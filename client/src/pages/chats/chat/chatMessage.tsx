import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './chatMessage.module.css';
import axios from 'axios';
import { IoSend } from "react-icons/io5";

import { Link } from 'react-router-dom';
import {  MessageT, UserC } from '../../../lib/types';
import ProfilePicture from '../../../components/ProfilePicture';
import { loggedInUserDetails } from '../../../state/LoggedInUser';
import Config from '../../../../config';

const socket = io(Config.socketUrl);
const server_url = Config.serverUrl;

interface ImageBuffer {
    image: {
        data: number[]
    }
}

function MessageComponent({ id, username }: { id: string, username: string }) {
    const [messages, setMessages] = useState<MessageT[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [myUsername, setMyUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [senderId, setSenderId] = useState('');
    const [typingIndicator, setTypingIndicator] = useState('');
    const [sendBtnVisibility, setSendBtnVisibility] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserC>()
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [profilePic, setProfilePic] = useState<ImageBuffer>()

    const user = loggedInUserDetails()

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get(`${server_url}/users/username/${username}`, {
                    headers: {
                        Authorization: 'Bearer ' +localStorage.getItem('token')
                    }
                })
                
                setSelectedUser(res.data.user)
                setProfilePic(res.data.profilePicture)
            } catch (error) {
                console.error(error);
                
            }
        }
        getUser()
    },[])


    useEffect(() => {
        const username = user.user?.username;
        setMyUsername(username as string);
        setSenderId(user.user?._id as string);

        // Join the room based on the selected user
        socket.emit("joinRoom", { userId1: senderId, userId2: selectedUser?._id });

        socket.on('roomJoined', (roomName) => {
            setRoomName(roomName);
        });

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("typing", (username) => {
            if (username !== myUsername) {
                setTypingIndicator(`${username} is typing...`);
            }
        });

        socket.on("stopTyping", () => {
            setTypingIndicator('');
        });

        async function getMessages() {
            try {
                const chats = (await axios.get(`${server_url}/chats/${id}`)).data.chats;
                setMessages(chats);

            } catch (error) {
                console.error(error);
            }
        }

        getMessages(); // Fetch messages for the selected user

        return () => {
            // Cleanup on component unmount
            socket.off("message");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [selectedUser?._id]);

    useEffect(() => {
        // Scroll to the bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        if (e.target.value.length > 0) {
            setSendBtnVisibility(true);
            socket.emit("typing", { roomName, username: myUsername });
        } else {
            setSendBtnVisibility(false);
            socket.emit("stopTyping", { roomName, username: myUsername });
        }
    };

    const handleStopTyping = () => {
        socket.emit("stopTyping", { roomName, username: myUsername });
    };

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (messageInput.trim() !== "" && roomName) {
            const message = { content: messageInput, timestamp: new Date(), senderId: senderId };
            socket.emit("message", { roomName, message, senderId, user2: selectedUser?._id });
            setMessageInput("");
            handleStopTyping();
        }
    };

    return (
        <div className="h-[90%] md:h-[99%] relative">
            <div className="rounded-lg h-full overflow-auto w-full shadow-md flex flex-col justify-between">
                <div className='bg-primary absolute top-0 z-10 w-full'>
                    <div className='flex items-center gap-x-4 md:p-2 px-3 py-2'>
                        
                        <Link to={`/users/${selectedUser?.username}`} className='flex items-center gap-x-4 '>
                            <ProfilePicture imageData={profilePic?.image.data || []} height='md:h-14 h-10' width='md:w-14 w-10' />
                            <div className='flex flex-col gap-y-1'>
                                <h3 className='font-semibold text-lg text-base-100'>{selectedUser?.firstname} {selectedUser?.lastname}</h3>
                                <p className='text-slate-800 text-opacity-70 text-sm'>click here for account info</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="flex-1 pt-20 pb-16 p-2 bg- overflow-auto rounded-md">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex flex-col items-start w-full">
                            <div className={`chat ${msg.senderId === senderId ? 'chat-end' : 'chat-start'} w-full`}>
                                <div className="chat-header " >
                                    {msg.username}
                                    <time className="text-xs opacity-50 ml-2">{new Date(msg.createdAt).toLocaleTimeString()}</time>
                                </div>
                                <div className={`chat-bubble ${msg.senderId === senderId ? ' bg-blue-500 text-white' : 'bg-slate-200 text-black'} `}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className=' w-full'>
                        {typingIndicator &&
                            <div className={`chat ${selectedUser?._id === senderId ? 'chat-end' : 'chat-start'} w-full p-3`}>
                                {/* <div className="chat-header">
                                </div>
                                <div className={`chat-bubble bg-slate-200 text-slate-600`}>
                                </div> */}
                                     <div className={styles.loader}></div>
                            </div>
                        }
                        <div ref={messagesEndRef} />
                    </div>

                </div>
                <form onSubmit={sendMessage} className="flex flex-col h-auto relative bg-base-100 border-[1px] border-base-300 bottom-0">
                    <div className="bg-base-100 p-3 absolute bottom-0 z-10 w-full">
                        <div className="flex items-center gap-x-4">
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-base-200 text-slate-300 outline-none"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={handleInputChange}
                                onBlur={handleStopTyping}
                            />
                        
                            {sendBtnVisibility && <button>
                                <IoSend className="text-2xl text-blue-500" />
                            </button>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MessageComponent;