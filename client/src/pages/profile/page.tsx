import useStore from "@/context/store"


export default function Profile() {
    const userInfo = useStore((state) => state.userInfo)
    return (
        <div>{userInfo?.name}</div>
    )
}
