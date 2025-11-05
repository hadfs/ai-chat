import { Injectable, Header, Res } from '@nestjs/common';
import OpenAI from 'openai';
import { getTokens } from 'src/lib/token';

@Injectable()
export class ChatService {
    public openai: OpenAI
    constructor() {
        this.openai = new OpenAI({
            apiKey: getTokens().token,
            baseURL: getTokens().api_host,
        });
    }
    async chat(body: {
        message: string;
        model?: string
    }) {
        if (!body.message) {
            throw new Error("message is required");
        }
        if (body.model) {
            const modelList = await this.getModelList()
            if (!modelList || !modelList.length) {
                return
            }
            if (!modelList.find(item => item.id === body.model)) {
                // 校验model名字是否在模型列表中
                throw new Error("model_name is not in model list");
            }
        }
        const completion = await this.openai.chat.completions.create({
            model: body.model || getTokens().model_name,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: body.message },
            ],
        });
        const result = completion.choices[0].message.content;
        return {
            msg: result,
        };
    }

    async chatStream(@Res() res, body: {
        message: string;
        model?: string
    }) {
        if (!body.message) {
            throw new Error("message is required");
        }
        if (body.model) {
            const modelList = await this.getModelList()
            if (!modelList || !modelList.length) {
                return
            }
            if (!modelList.find(item => item.id === body.model)) {
                // 校验model名字是否在模型列表中
                throw new Error("model_name is not in model list");
            }
        }
        const completion = await this.openai.chat.completions.create({
            model: body.model || getTokens().model_name,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: body.message },
            ],
            stream: true,
        });
        // SSE headers to ensure proxies/browsers do not buffer
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // for Nginx
        });
        res.flushHeaders?.();

        // Stream chunks in SSE format: each message line starts with `data:` and ends with double newlines
        try {
            for await (const chunk of completion) {
                const delta = chunk.choices?.[0]?.delta?.content ?? '';
                if (delta) {
                    res.write(`data: ${delta}\n\n`);
                }
            }
            // Signal completion to client
            res.write('event: done\n');
            res.write('data: [DONE]\n\n');
        } catch (err) {
            // Forward error to client
            res.write('event: error\n');
            res.write(`data: ${JSON.stringify({ message: String(err) })}\n\n`);
        } finally {
            res.end();
        }
        // return {
        //     message
        // }
    }
    async getModelList(): Promise<{ id: string }[] | null> {
        const list = await this.openai.models.list();
        if (list.data) {
            return list.data
        }
        return null
    }
}
