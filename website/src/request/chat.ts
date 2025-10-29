import { request } from "."

export const sendMessage = (data: {
    message: string;
    model?: string
}) => {
    return request<{
        msg: string
    }>({
        url: '/chat',
        method: 'post',
        data,
    })
}