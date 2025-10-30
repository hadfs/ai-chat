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

export const getModels = () => {
    return request({
        url: '/models',
        method: 'get'
    })
}