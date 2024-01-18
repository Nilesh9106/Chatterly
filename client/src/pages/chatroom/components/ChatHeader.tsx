import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import useStore from "@/context/store"
import { Chat } from "@/models"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ChatHeader({ chat }: { chat: Chat | undefined }) {
    const navigate = useNavigate()
    const userInfo = useStore(state => state.userInfo)
    const receiver = chat?.users.find((u) => u._id != userInfo?._id)
    return (
        <>
            <div className="flex cursor-pointer items-center p-2 space-x-4 dark:bg-neutral-900 bg-neutral-200 transition-all">
                <Button variant={"ghost"} size={"icon"} className="rounded-full" onClick={() => navigate('/')} >
                    <ArrowLeft size={24} />
                </Button>
                <Avatar>
                    <AvatarImage src={receiver?.pic} />
                    <AvatarFallback>ND</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <div className="font-semibold">{chat?.isGroupChat ? chat.chatName : receiver?.name}</div>
                    <div className="text-sm text-gray-500">{chat?.latestMessage?.message}</div>
                </div>
            </div>
        </>
    )
}
