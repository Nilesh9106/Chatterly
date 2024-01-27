import Loading from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useStore from "@/context/store"
import { getCall, putCall } from "@/lib/api"
import { Chat, User } from "@/models"
import { ArrowLeft, MoreVertical, Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function ChatHeader({ chat }: { chat: Chat | undefined }) {
    const navigate = useNavigate()
    const userInfo = useStore(state => state.userInfo)
    const setChats = useStore(state => state.setChats);
    const chats = useStore(state => state.chats);
    const receiver = chat?.users.find((u) => u._id != userInfo?._id)
    const [users, setUsers] = useState([] as User[])
    const [open, setOpen] = useState(false)
    const [addUser, setAddUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")

    const deleteUser = async (id: string) => {
        const data = await putCall(`chats/groupremove`, {
            chatId: chat?._id,
            userId: id
        });
        if (data) {
            setChats(chats.map((c) => c._id == chat?._id ? data as Chat : c))
            toast.success("User removed")
        }
    }

    const handleAddUser = async (id: string) => {
        setLoading(true)
        const data = await putCall(`chats/groupadd`, {
            chatId: chat?._id,
            userId: id
        });
        if (data) {
            setChats(chats.map((c) => c._id == chat?._id ? data as Chat : c))
            toast.success("User added")
            setAddUser(false)
            setOpen(true)
        }

        setLoading(false)
    }

    const handleChange = async () => {
        setLoading(true)
        const data = await getCall(`users/?search=${query}`)
        if (data) {
            setUsers((data as User[]).filter((u) => !chat?.users.find((user) => user._id == u._id)));
        }
        setLoading(false)
    }

    return (
        <>
            <div className="flex sticky top-0  z-50 items-center p-2 space-x-4 dark:bg-neutral-900 bg-neutral-200 transition-all">
                <Button variant={"ghost"} size={"icon"} className="rounded-full" onClick={() => navigate('/')} >
                    <ArrowLeft size={24} />
                </Button>
                <Avatar>
                    <AvatarImage src={receiver?.pic} />
                    <AvatarFallback>ND</AvatarFallback>
                </Avatar>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <div className="space-y-1 cursor-pointer ">
                            <div className="font-semibold">{chat?.isGroupChat ? chat.chatName : receiver?.name}</div>
                            <div className="text-sm text-gray-500">{chat?.latestMessage?.message}</div>
                        </div>
                    </DialogTrigger>
                    <DialogContent >
                        <DialogHeader>
                            <DialogTitle>{chat?.isGroupChat ? chat.chatName : receiver?.name}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col items-center gap-3">
                                    <img src={receiver?.pic} alt={receiver?.name} className="size-48 rounded-full" />
                                    <div className="font-semibold text-2xl">{chat?.isGroupChat ? chat.chatName : receiver?.name}</div>
                                </div>
                                <hr />
                                <div className="gap-3 flex flex-col">
                                    <div className="font-semibold">Members</div>
                                    {chat?.users.map((user) => (
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
                                            {chat.isGroupChat && chat.groupAdmin._id == userInfo?._id &&
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"ghost"} size={"icon"}>
                                                            <MoreVertical size={20} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => deleteUser(user._id)} className="text-red-500">Remove</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>}
                                        </div>
                                    ))}
                                </div>

                                {chat?.isGroupChat && chat?.groupAdmin._id == userInfo?._id && <>
                                    <hr />
                                    <Button onClick={() => {
                                        setOpen(false)
                                        setAddUser(true)
                                    }} >Add user</Button>
                                </>}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
                <Dialog open={addUser} onOpenChange={setAddUser}>
                    <DialogContent>
                        <DialogHeader >
                            <div className="flex gap-2 items-center">
                                <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="my-4 flex-1" type="search" />
                                <Button variant={"ghost"} onClick={handleChange}>
                                    <Search size={20} />
                                </Button>
                            </div>
                        </DialogHeader>
                        <ScrollArea className="flex-1 overflow-y-auto  ">
                            {loading && <Loading />}
                            {!loading && users.length == 0 && <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">No User Found</div>}
                            {users.map((user: User, i: number) => {
                                return <div onClick={() => handleAddUser(user._id)} key={i} className={`flex cursor-pointer rounded-md items-center justify-between p-2 space-x-4 dark:hover:bg-neutral-900 hover:bg-neutral-200 transition-all`}>
                                    <div className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={user.pic} />
                                            <AvatarFallback>ND</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <div className="font-semibold">{user.name}</div>
                                        </div>
                                    </div>
                                </div>
                            })}

                        </ScrollArea>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    )
}
