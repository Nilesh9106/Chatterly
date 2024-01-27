import { Loader2Icon } from "lucide-react";


export default function Loading() {
    return (
        <div className="flex items-center justify-center h-full animate-spin"><Loader2Icon size={48} /></div>
    )
}