// ChatRoom.js

import { ScrollArea } from "@/components/ui/scroll-area";
import RightChat from "./components/RightChat";
import LeftChat from "./components/LeftChat";
import ChatHeader from "./components/ChatHeader";
import { Input } from "@/components/ui/input";
import './chat.css'
import { Button } from "@/components/ui/button";
import { SendHorizontal, SmileIcon } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Chat, Message } from "@/models";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useStore from "@/context/store";
import io, { Socket } from "socket.io-client";
import { getCall, postCall } from "@/lib/api";


const endpoint = import.meta.env.VITE_SOCKET as string;
let socket: Socket;


const ChatRoom = () => {
    const { id } = useParams()
    const chats = useStore((state) => state.chats);
    const setChats = useStore((state) => state.setChats);
    const userInfo = useStore((state) => state.userInfo);
    const navigate = useNavigate()
    const location = useLocation()
    const [messages, setMessages] = useState<Message[]>([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
    }


    const ChatLoader = async () => {
        setLoading(true)
        const res = await getCall(`messages/${id}`)
        setMessages(res as Message[])
        setLoading(false)
        socket.emit("join chat", id)

    }

    const sendMessage = async () => {
        setContent(content.trim())
        const data = {
            content: content,
            chatId: id
        }
        const res = await postCall("messages", data)
        setMessages([...messages, res as Message])
        setContent("")
        console.log("sent: ", (res as Message).message);
        socket.emit("new message", res as Message)
        const data1 = await getCall("chats");
        if (data1) {
            setChats(data1 as Chat[])
        }
    }

    const messageReceived = async (message: Message) => {
        if (message.chat._id == id) {
            setMessages((messages) => [...messages, message])
        } else {
            console.log(`new message from ${message.sender.name}`);
        }
        if (!loading) {
            setLoading(true)
            const data1 = await getCall("chats");
            if (data1) {
                setChats(data1 as Chat[])
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        socket = io(endpoint);
        socket.emit("setup", userInfo)
        socket.on("message received", messageReceived);
    }, [])

    useEffect(() => {
        setMessages([])
        setContent("")
        if (!chats.find((chat: Chat) => chat._id == id)) {
            toast.error("Chat not found")
            navigate("/chats")
        }
        ChatLoader()
    }, [location])



    useEffect(() => {
        scrollToBottom()
    }, [messages]);



    return (
        <div className="flex svg-bg  flex-col  h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-800 dark:text-white">

            <ChatHeader chat={chats.find((chat: Chat) => chat._id == id)} />
            {loading && <div className="flex-1 flex justify-center items-center">Loading...</div>}
            <ScrollArea className="flex-1 overflow-y-auto px-4 ">
                {messages.map((message: Message, i: number) => (
                    message.sender._id == JSON.parse(localStorage.getItem("userInfo")!)._id ? (
                        <RightChat key={i} message={message} />
                    ) : (
                        <LeftChat key={i} message={message} />
                    )
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>

            <div className=" pb-4 pt-1 flex justify-center items-center">
                <div className="max-w-4xl flex items-center justify-center space-x-2  w-full">
                    <Button variant={"secondary"} className="rounded-full h-10 w-10" size={"icon"} >
                        <SmileIcon size={24} />
                    </Button>
                    <Input type="text" placeholder="Message" onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            sendMessage()
                        }
                    }} value={content} onChange={(e) => setContent(e.target.value)} className="dark:bg-neutral-900 bg-neutral-200  flex-1 h-10 rounded-lg" />
                    <Button variant={"default"} onClick={sendMessage} className="rounded-full h-10 w-10" size={"icon"} >
                        <SendHorizontal size={24} />
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default ChatRoom;
