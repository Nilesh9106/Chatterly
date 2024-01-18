import { Chat, User } from '@/models'
import { create } from 'zustand'


interface chatState {
    userInfo: User | null
    chats: Chat[]
    login: (user: User) => void
    setChats: (chats: Chat[]) => void
    addChat: (chat: Chat) => void
}

const useStore = create<chatState>()((set) => ({
    userInfo: null,
    chats: [],
    login: (userInfo) => set({ userInfo: userInfo, }),
    setChats: (chats) => set({ chats: chats, }),
    addChat: (chat) => {
        if (useStore.getState().chats.find((c) => c._id == chat._id)) {
            return
        } else {
            set((state) => ({ chats: [...state.chats, chat], }))
        }
    },
}))

export default useStore


