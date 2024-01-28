import { Loader2Icon } from "lucide-react";


export default function Loading() {
    return (
        <div className="flex overflow-hidden items-center justify-center flex-1 "><Loader2Icon className="animate-spin" size={48} /></div>
    )
}