
import tokens from '../../../tokens.js'

export const getTokens = () => {
    return {
        ...tokens
    } as {
        token: string;
        api_host: string;
        model_name: string
    }
}