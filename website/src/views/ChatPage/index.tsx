import { useEffect, useRef, useState } from "react"
import { Message } from "./types"
import { Bubble, Sender } from "@ant-design/x";
import { getModels } from "../../request/chat";
import Markdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useQuery } from "@tanstack/react-query";
import { Select } from 'antd'

const ChatPage = () => {
    const [chatList, setChatList] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [inputLoading, setInputLoading] = useState(false);
    const { data: modelList } = useQuery({
        queryFn: () => getModels().then(res => res.data),
        queryKey: ['modelList'],
    })
    const [model, setModel] = useState('')

    useEffect(() => {
        if (modelList?.length) {
            setModel(modelList[0].id)
        }
    }, [modelList])
    const lastMessage = useRef('')

    const updateMessage = (mes: string) => {
        if (mes.includes(' ')) {
            console.log(mes, '=====', lastMessage.current)
        }
        setChatList(list => {
            if (mes === lastMessage.current) {
                return list
            }
            lastMessage.current = mes
            const last = list.pop()
            if (!last) {
                return []
            }
            // console.log(mes, '========\n\n\n\n',  last.content, 'ljh 35')
            last.content += mes
            last.isLoading = false
            list.push({ ...last })
            return [...list]
        })
    }

    const handleSubmit = (v: string) => {
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
        const es = new EventSource(`http://localhost:3000/chatStream?prompt=${v}&model=${model}`)
        es.onmessage = e => {
            updateMessage(e.data)
        }
        es.addEventListener('done', () => {
            es.close()
            setInputLoading(false)
        })
        es.onerror = (e) => {
            console.log(e, 'es error')
            setInputLoading(false)
            es.close()
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
        }
    }

    return (
        <div>
            {chatList.map((item, index) => (
                <Bubble
                    key={index}
                    content={
                        <Markdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeHighlight]}
                        >{item.content}</Markdown>
                    }
                    placement={item.isUser ? "end" : "start"}
                    loading={item.isLoading}
                    avatar={item.isUser ? <div>User</div> : <div>GPT</div>}
                    typing={true}
                    styles={{
                        content: {
                            maxWidth: '400px'
                        }
                    }}
                />
            ))}
            <Sender
                loading={inputLoading}
                value={input}
                onChange={(v) => {
                    setInput(v);
                }}
                disabled={!model}
                onSubmit={handleSubmit}
            />
            <Select
                options={modelList?.map(item => ({
                    label: item.id,
                    value: item.id,
                })) || []}
                value={model}
                onChange={(v) => {
                    setModel(v)
                }}
                style={{
                    width: '200px'
                }}
            />
        </div>
    );
}

export default ChatPage