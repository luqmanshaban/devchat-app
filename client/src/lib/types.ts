
export interface ImageBuffer {
    type: string
    data: number[]
}


export interface User {
    _id: string
    firstname: string
    lastname: string
    username: string
    email: string
    title: string
    about: string
    profile: number[]
    profilePicture: number[]
    status: string
}
export interface UserC {
    _id: string
    firstname: string
    lastname: string
    username: string
    email: string
    title: string
    about: string
    profile: number[]
    profilePicture: ImageBuffer
    status: string
}

interface Messages {
    senderId: string
    content: string
    createdAt: string
}

export interface MessageT {
    content: string;
    timestamp: Date;
    username: string
    profilePicture: string
    senderId: string
    createdAt: string
}


export interface PairedUsersM {
    _id: string
    users: [{
        _id: string
        firstname: string
        lastname: string
        username: string
        email: string
        title: string
        about: string
        profile: number[]
        profilePicture: ImageBuffer
        status: string
    }]
    roomId: string
    messages: Messages[]
    chats: {
        _id: string,
        messages: Messages[]
    }
    createdAt: string
    updatedAt: string
}

export interface PairedUsersT {
    _id: string
    users: [{
        _id: string
        firstname: string
        lastname: string
        username: string
        email: string
        title: string
        about: string
        profile: number[]
        profilePicture: ImageBuffer
    }]
    roomId: string
    messages: Messages[]
    chats: string
    createdAt: string
    updatedAt: string
}

export interface ConnectionRequestT {
    _id: string
    senderId: User
    recipientId: string
    status: string
    createdAt: string
    updatedAt: string
    profilePicture: ImageBuffer
}

export interface InputProps {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    labelText: string;
    labelFor: string;
    id: string;
    name: string;
    type: string;
    isRequired?: boolean;
    placeholder: string;
    customClass: string;
}
