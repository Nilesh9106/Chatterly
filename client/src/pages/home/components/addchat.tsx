
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useStore from "@/context/store"
import { getCall, postCall } from "@/lib/api"
import { Chat, User } from "@/models"
import { DialogClose } from "@radix-ui/react-dialog"
import { ArrowLeft, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"



export default function AddChat() {
    const userInfo = useStore((state) => state.userInfo)
    const addChat = useStore((state) => state.addChat)
    const [users, setUsers] = useState<User[]>([])
    const [group, setGroup] = useState<User[]>([])
    const [open, setOpen] = useState(false)
    const [groupOpen, setGroupOpen] = useState(false)
    const [groupName, setGroupName] = useState("")
    const navigate = useNavigate()

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        const data = await getCall(`users/?search=${e.target.value}`)
        if (data) {
            setUsers(data as User[]);
        }
    }

    const createGroup = async () => {
        const allUsers = [...group]
        if (allUsers.length == 2) {
            toast.error("Select at least two user to create group")
            return
        }
        if (groupName.trim() == "") {
            toast.error("Enter group name")
            return
        }
        const data = {
            users: allUsers,
            name: groupName
        }
        const res = await postCall("chats/group", data);
        addChat(res as Chat)
        navigate(`/chats/${res.data._id}`)
        toast.success("Chat created")
        setOpen(false)
        setGroupOpen(false)
    }

    const handleSubmit = async () => {
        const allUsers = [...group, userInfo]
        if (allUsers.length == 1) {
            toast.error("Select at least one user")
            return
        }
        if (allUsers.length == 2) {
            const res = await postCall("chats", {
                userId: group[0]._id,
            });
            addChat(res as Chat)
            navigate(`/chats/${res.data._id}`)
            toast.success("Chat created")
            setOpen(false)
        } else if (allUsers.length > 2) {
            setOpen(false)
            setGroupOpen(true)
        }
    }
    return (
        <>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                        <Plus />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <Input placeholder="Search" onChange={(e) => handleChange(e)} className="my-4" type="search" />
                    </DialogHeader>
                    <ScrollArea className="flex-1 overflow-y-auto  ">
                        {users.length == 0 && <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">No chats</div>}
                        {users.map((user: User, i: number) => {
                            return <div key={i} className={`flex cursor-pointer rounded-md items-center justify-between p-2 space-x-4 dark:hover:bg-neutral-900 hover:bg-neutral-200 transition-all`}>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={user.pic} />
                                        <AvatarFallback>ND</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="font-semibold">{user.name}</div>
                                    </div>
                                </div>
                                <Checkbox onCheckedChange={(e) => {
                                    if (e) {
                                        if (group.filter((u) => u._id == user._id).length > 0) return
                                        setGroup([...group, user])
                                    } else {
                                        setGroup(group.filter((u) => u._id != user._id))
                                    }
                                }} />
                            </div>
                        })}

                    </ScrollArea>
                    <DialogFooter className="flex ">
                        <DialogClose className="flex-1" asChild>
                            <Button variant="secondary" className="w-full" >Cancel</Button>
                        </DialogClose>
                        <Button variant="default" className="flex-1" onClick={handleSubmit}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={groupOpen} onOpenChange={setGroupOpen}>
                <DialogContent>
                    <DialogHeader >
                        <div className="flex space-x-2 items-center">
                            <Button onClick={() => {
                                setGroupOpen(false)
                                setOpen(true)
                            }} variant="ghost" size="icon" >
                                <ArrowLeft size={24} />
                            </Button>
                            <Input placeholder="Group name" onChange={(e) => setGroupName(e.target.value)} className="my-4" type="text" />
                        </div>
                    </DialogHeader>
                    <ScrollArea className="flex-1 overflow-y-auto  ">
                        {group.length < 2 && <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">You cant make group with only one person</div>}
                        {group.map((user: User, i: number) => {
                            return <div key={i} className={`flex cursor-pointer rounded-md items-center justify-between p-2 space-x-4 dark:hover:bg-neutral-900 hover:bg-neutral-200 transition-all`}>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={user.pic} />
                                        <AvatarFallback>ND</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="font-semibold">{user.name}</div>
                                    </div>
                                </div>
                                <Checkbox checked onCheckedChange={(e) => {
                                    if (e) {
                                        if (group.filter((u) => u._id == user._id).length > 0) return
                                        setGroup([...group, user])
                                    } else {
                                        setGroup(group.filter((u) => u._id != user._id))
                                    }
                                }} />
                            </div>
                        })}

                    </ScrollArea>
                    <DialogFooter className="flex ">
                        <DialogClose className="flex-1" asChild>
                            <Button variant="secondary" className="w-full" >Cancel</Button>
                        </DialogClose>
                        <Button variant="default" className="flex-1" onClick={createGroup}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
