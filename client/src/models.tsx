
export interface User {
    _id: string;
    name: string;
    pic: string;
    email: string;
    token: string | undefined;
}

export interface Message {
    _id: string;
    sender: User;
    message: string;
    chat: Chat;
    createdAt: string;
    updatedAt: string;
}

export interface Chat {
    _id: string;
    users: User[];
    chatName: string;
    isGroupChat: boolean;
    latestMessage: Message;
    groupAdmin: User;
    createdAt: string;
    updatedAt: string;
}