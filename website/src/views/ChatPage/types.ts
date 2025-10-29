export interface Message {
    role: 'user' | 'assistant'
    content: string
    id: string
    isUser: boolean
    createdAt: Date | string | number;
    isLoading: boolean;
}