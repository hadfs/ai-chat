import { useState } from "react"
import { Message } from "./types"
import { Bubble, Sender } from "@ant-design/x";
import { sendMessage } from "../../request/chat";
import Markdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';


const ChatPage = () => {
    const [chatList, setChatList] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [inputLoading, setInputLoading] = useState(false);

    return (
        <div>
            {chatList.map((item, index) => (
                <Bubble
                    key={index}
                    content={
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >{item.content}</Markdown>
                    }
                    placement={item.isUser ? "end" : "start"}
                    loading={item.isLoading}
                    avatar={item.isUser ? <div>User</div> : <div>GPT</div>}
                    typing={true}
                    style={{
                        maxWidth: '400px'
                    }}
                />
            ))}
            <Sender
                loading={inputLoading}
                value={input}
                onChange={(v) => {
                    setInput(v);
                }}
                onSubmit={(v) => {
                    setInputLoading(true);
                    setChatList([
                        ...chatList,
                        {
                            content: v,
                            isUser: true,
                            createdAt: new Date(),
                            isLoading: false,
                            id: Date.now().toString(),
                            role: "user",
                        },
                    ]);
                    setInput("");
                    setChatList(list => {
                        return [
                            ...list,
                            {
                                content: '',
                                isUser: false,
                                createdAt: new Date(),
                                isLoading: true,
                                id: Date.now().toString(),
                                role: "assistant",
                            } as any
                        ]
                    })
                    sendMessage({
                        message: v
                    }).then((res: any) => {
                        console.log(res, 'ljh res')
                        if (!res.msg) {
                            setInputLoading(false)
                            setChatList((list) => {
                                list.pop()
                                list.push({
                                    content: "很抱歉，请你重试",
                                    isUser: false,
                                    createdAt: new Date(),
                                    isLoading: false,
                                    id: Date.now().toString(),
                                    role: "assistant",
                                })
                                return list
                            })
                            return
                        }
                        setChatList((list) => {
                            list.pop()
                            return [
                                ...list,
                                {
                                    content: res.msg,
                                    isUser: false,
                                    createdAt: new Date(),
                                    isLoading: false,
                                    id: Date.now().toString(),
                                    role: "assistant",
                                },
                            ]
                        });
                        setInputLoading(false);
                    })
                }}
            />
        </div>
    );
}

export default ChatPage