import axios from "axios";
import { redirect } from "react-router-dom";
import { toast } from "sonner";

export const getCall = async (endPoint: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/${endPoint}`, {
            headers: {
                Authorization: `${JSON.parse(localStorage.getItem("userInfo")!)?.token}`
            }
        });
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status == 401) {
                localStorage.removeItem("userInfo")
                return redirect("/")
            }
            toast.error(error.response?.data?.message ?? "Something went wrong")
        } else {
            toast.error("Something went wrong")
        }
    }
}

export const postCall = async (endPoint: string, data: unknown) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URI}/${endPoint}`, data, {
            headers: {
                Authorization: `${JSON.parse(localStorage.getItem("userInfo")!)?.token}`
            }
        });
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status == 401) {
                localStorage.removeItem("userInfo")
                return redirect("/")
            }
            toast.error(error.response?.data?.message ?? "Something went wrong")
        } else {
            toast.error("Something went wrong")
        }
    }
}