import { Injectable } from '@nestjs/common';
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
    async chat(body: any) {
        if (!body.message) {
            throw new Error("message is required");
        }
        if (body.model_name) {
            const modelList = await this.getModelList()
            if (!modelList || !modelList.length) {
                return
            }
            if (!modelList.find(item => item.id === body.model_name)) {
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
    async getModelList(): Promise<{ id: string }[] | null> {
        const list = await this.openai.models.list();
        if (list.data) {
            return list.data
        }
        return null
    }
}
