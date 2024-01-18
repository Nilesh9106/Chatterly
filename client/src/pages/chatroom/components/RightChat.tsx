import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "@/models"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { useState } from "react"



export default function RightChat({ message }: { message: Message }) {
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        console.log("Delete")
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end cursor-pointer" onClick={() => setOpen(!open)} >
                        <div>
                            <div className="dark:bg-neutral-900/80 backdrop-blur-lg bg-neutral-200/80  p-3 rounded-l-lg rounded-br-lg">
                                <p className="text-sm">{message.message}</p>
                            </div>
                            <span className="text-xs text-gray-500 leading-none text-right float-right">{message.sender.name}</span>
                        </div>
                        <Avatar>
                            <AvatarImage src={message.sender.pic} />
                            <AvatarFallback>ND</AvatarFallback>
                        </Avatar>
                    </div>

                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={handleDelete} className="text-red-500">Delete</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>


        </>
    )
}
