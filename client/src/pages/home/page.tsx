
import { Outlet, redirect, useParams } from "react-router-dom";
import HomeHeader from "./components/Header";
import UserList from "./components/UserList";
import { useEffect, useState } from "react";
import useStore from "@/context/store";
import { getCall } from "@/lib/api";
import { Chat } from "@/models";
import Loading from "@/components/loading";



export default function Home() {
    const { id } = useParams()
    const chats = useStore((state) => state.chats);
    const userInfo = useStore((state) => state.userInfo);
    const setChats = useStore((state) => state.setChats);
    const [loading, setLoading] = useState(false)
    const getChats = async () => {
        if (!userInfo) {
            return redirect("/")
        }
        setLoading(true)
        const data = await getCall("chats");
        if (data) {
            setChats(data as Chat[])
        }
        setLoading(false)
    }

    useEffect(() => {
        getChats();
    }, [])
    return (
        <>
            <div className="flex w-full">
                <div className={`lg:w-[25%] md:w-[35%]   h-dvh flex flex-col  border ${id ? " max-md:hidden" : "max-md:w-full"}`}>
                    <HomeHeader />
                    {loading && <Loading />}
                    {!loading && <UserList users={chats} />}
                </div>
                <div className={`lg:w-[75%] md:w-[65%] ${id ? "max-md:w-full" : "max-md:hidden"}`}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

