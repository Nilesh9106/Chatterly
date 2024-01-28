import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Chat, Message } from "@/models"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { useState } from "react"
import { deleteCall } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"



export default function RightChat({ message, onDelete, chat }: { chat: Chat, message: Message, onDelete: () => void }) {
    const [open, setOpen] = useState(false)
    // const [readByLength, setReadByLength] = useState(false);
    const users = chat.users.filter((user) => {
        return !message.readBy.find((u) => u._id == user._id)
    })
    const handleDelete = async () => {
        const data = await deleteCall(`messages/${message._id}`);
        if (data) {
            onDelete()
        }
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end cursor-pointer" >
                        <div>
                            <div className="bg-blue-600 text-white backdrop-blur-lg   p-3 rounded-l-lg rounded-br-lg">
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
                    <ContextMenuItem onClick={() => setOpen(!open)}>Info</ContextMenuItem>
                    <ContextMenuItem onClick={handleDelete} className="text-red-500">Delete</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message Information</DialogTitle>
                    </DialogHeader>
                    <div className="gap-3 flex flex-col">
                        <div className="font-semibold">Read By</div>
                        {message?.readBy.map((user) => {
                            if (user._id == message.sender._id) return null;
                            return (
                                <div key={user._id} className="flex items-center justify-between gap-2 hover:opacity-80 cursor-pointer  transition-all">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.pic} />
                                            <AvatarFallback>ND</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-neutral-500 text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {message.readBy.length == 1 && <div className="text-neutral-500 text-xs">No one read this message yet</div>}
                    </div>
                    <hr />
                    <div className="gap-3 flex flex-col">
                        <div className="font-semibold">Remaining</div>
                        {users.map((user) => {
                            if (user._id == message.sender._id) return;
                            return (
                                <div key={user._id} className="flex items-center justify-between gap-2 hover:opacity-80 cursor-pointer  transition-all">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.pic} />
                                            <AvatarFallback>ND</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-neutral-500 text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {users.length == 0 && <div className="text-neutral-500 text-xs">No one is remaining to read</div>}
                    </div>

                </DialogContent>
            </Dialog>

        </>
    )
}
