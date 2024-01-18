import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "@/models"

export default function LeftChat({ message }: { message: Message }) {
    return (
        <>
            <div className="flex w-full mt-2 space-x-3 max-w-md">
                <Avatar>
                    <AvatarImage src={message.sender.pic} />
                    <AvatarFallback>ND</AvatarFallback>
                </Avatar>
                <div>
                    <div className="dark:bg-neutral-900/80 backdrop-blur-lg bg-neutral-200/80 p-3 rounded-r-lg rounded-bl-lg">
                        <p className="text-sm">{message.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 leading-none">{message.sender.name}</span>
                </div>
            </div>
        </>
    )
}
