import { Button } from "@/components/ui/button"
import useStore from "@/context/store"
import { deleteCall, putCall } from "@/lib/api";
import { Chat, User } from "@/models";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";

const endpoint = import.meta.env.VITE_SOCKET as string;
let socket: Socket;
export default function Profile() {
    const userInfo = useStore((state) => state.userInfo)
    const login = useStore((state) => state.login)
    const [file, setFile] = useState<string | ArrayBuffer | null>("");
    const fileRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleFileChange = () => {
        fileRef.current?.click();
    }

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        let selectedFile: File;
        if (event.target.files && event.target.files.length > 0) {
            selectedFile = event.target.files[0];
        }

        if (selectedFile!) {

            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');

                    // Set the canvas dimensions to the desired size (e.g., 300x300)
                    const maxWidth = 250;
                    const maxHeight = 250;

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw the image on the canvas
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Get the base64 representation with reduced size
                    const base64Data = canvas.toDataURL('image/png');
                    console.log(base64Data.length);

                    setFile(base64Data);
                };

                if (e.target) {
                    img.src = e.target.result as string;
                }
            };

            // Read the selected image as a data URL
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpdate = async () => {
        setLoading(true)
        const data = {
            pic: file
        }
        toast.promise(putCall(`users/${userInfo?._id}`, data), {
            loading: "Updating...",
            success: (data: User) => {
                if (data) {
                    data.token = userInfo?.token
                    login(data)
                    localStorage.setItem("userInfo", JSON.stringify(data))
                }
                setFile("")
                setLoading(false)
                return "Updated Successfully!!"
            },
            error: () => {
                setLoading(false)
                return "Something went wrong!!"
            }
        })
    }

    const handleDelete = async () => {

        setLoading(true)
        if (confirm("Are you sure you want to delete your account?") === false) {
            setLoading(false)
            return;
        }
        toast.promise(deleteCall(`users/${userInfo?._id}`), {
            loading: "Deleting...",
            success: (data: Chat[]) => {
                if (data) {
                    data.forEach((chat) => {
                        socket.emit("chat deleted", chat)
                    })
                    localStorage.removeItem("userInfo")
                    setLoading(false)
                    navigate('/')
                    return "Deleted"
                }
                setLoading(false)
                return "Error"
            },
            error: () => {
                setLoading(false)
                return "Error"
            }
        });
    }

    useEffect(() => {
        socket = io(endpoint);
        socket.emit("setup", userInfo)

        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <>
            <div className="flex flex-col max-w-3xl mx-auto my-5 border rounded p-5 dark:border-neutral-800">
                <div className="flex gap-10">
                    <input ref={fileRef} className="hidden" accept="image/*" type="file" onChange={handleImageSelect} />
                    <img className="size-32 rounded-full" onClick={handleFileChange} src={(file?.toString()) || userInfo?.pic} alt="" />
                    <div className="flex flex-col ">
                        <h1 className="text-2xl font-semibold mt-2">{userInfo?.name}</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{userInfo?.email}</p>
                        {file?.toString() !== "" && <Button disabled={loading} className="my-3" size={"sm"} onClick={handleUpdate} >Save</Button>}
                        <Button disabled={loading} className="my-3" variant={"destructive"} size={"sm"} onClick={handleDelete} >Delete Account</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
