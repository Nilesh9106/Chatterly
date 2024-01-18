import { useEffect, useState } from 'react'
import './chat.css'
import { Socket, io } from 'socket.io-client';
import useStore from '@/context/store';
import { Chat, Message } from '@/models';
import { getCall } from '@/lib/api';

const endpoint = import.meta.env.VITE_SOCKET as string;
let socket: Socket;
export default function NoChatRoom() {
    const userInfo = useStore((state) => state.userInfo);
    const setChats = useStore((state) => state.setChats);
    const [loading, setLoading] = useState(false)
    const messageReceived = async (message: Message) => {
        console.log(`new message from ${message.sender.name}`);

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
    return (
        <>
            <div className="flex svg-bg  flex-col  h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-800 dark:text-white">

                <div className="flex flex-col justify-center items-center h-full">
                    <div className="text-2xl font-semibold">Select a chat to start messaging</div>
                    <div className="text-gray-500">Click on the left side user to start messaging</div>
                </div>
            </div>
        </>
    )
}
