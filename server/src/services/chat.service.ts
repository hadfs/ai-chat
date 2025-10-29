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
}
