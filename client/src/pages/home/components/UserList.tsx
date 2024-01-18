import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useParams } from "react-router-dom"
import { Chat } from "@/models";
import useStore from "@/context/store";



export default function UserList({ users }: { users: Chat[] }) {
    const { id } = useParams()
    // console.log(users);
    const userInfo = useStore((state) => state.userInfo)


    return (
        <>
            <ScrollArea className="w-full flex-1 overflow-y-auto ">

                <div className="flex flex-col">
                    {users.length == 0 && <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">No chats</div>}
                    {users.map((user: Chat, i: number) => {
                        const receiver = user.users.find((u) => u._id != userInfo?._id)
                        return <Link to={`/chats/${user._id}`} key={i} className={`flex cursor-pointer rounded items-center p-2 space-x-4 dark:hover:bg-neutral-900 hover:bg-neutral-200 transition-all ${(id) == user._id ? "dark:bg-neutral-900 bg-neutral-200" : ""}`}>
                            <Avatar>
                                <AvatarImage src={receiver?.pic} />
                                <AvatarFallback>ND</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <div className="font-semibold">{user.isGroupChat ? user.chatName : receiver?.name}</div>
                                <div className="text-sm text-gray-500">{user.latestMessage?.message ?? ""}</div>
                            </div>
                        </Link>
                    })}
                </div>

                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </>
    )
}
