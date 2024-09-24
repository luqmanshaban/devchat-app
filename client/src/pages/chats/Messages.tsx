import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PairedUsersM } from '../../lib/types'
import ProfilePicture from '../../components/ProfilePicture'
import { loggedInUserDetails } from '../../state/LoggedInUser'
import { io } from 'socket.io-client'
import Config from '../../../config'

const socket = io(Config.socketUrl)


const Messages = ({ pairs }: { pairs: PairedUsersM[] }) => {
    const navigate = useNavigate()
    const user = loggedInUserDetails()  
    const [userStatuses, setUserStatuses] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        // Listen for 'user-online' event
        socket.on('user-online', (userId: string) => {
            console.log(`${userId} is online`);
            
            setUserStatuses((prevStatuses) => ({
                ...prevStatuses,
                [userId]: 'online',
            }));
        });

        // Listen for 'user-offline' event
        socket.on('user-offline', (userId: string) => {
            console.log(`${userId} is offline`);
            setUserStatuses((prevStatuses) => ({
                ...prevStatuses,
                [userId]: 'offline',
            }));
        });

        // Listen for 'user-status-updated' event
        socket.on('user-status-updated', ({ userId, status }) => {
            console.log('////////');
            console.log(`${userId} is ${status}`);
            console.log('////');
            
            setUserStatuses((prevStatuses) => ({
                ...prevStatuses,
                [userId]: status,
            }));
        });
     
        
        

        // Cleanup the socket listeners when the component unmounts
        return () => {
            socket.off('user-online');
            socket.off('user-offline');
            socket.off('user-status-updated');
        };
    }, [userStatuses]);


    return (
        <div className='flex justify-start items-start flex-col gap-4 md:w-full'>
            <div className='flex flex-col gap-4 px-5 md:mb-4'>
                <h2 className='text-xl text-slate-300'>Recent Conversations</h2>
                <p className='text-sm text-slate-500'>Messages you might have missed</p>
            </div>
            {pairs.length > 0 ? (<div className="overflow-x-auto w-full">
                <table className="table">
                    {/* head */}
                    <thead className=''>
                        <tr className=''>
                            <th>User</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {
                            pairs.filter(pair => pair._id !== user?.user?._id).map(pair => (
                                <tr className=' hover:bg-neutral/50 cursor-pointer' onClick={() => navigate(`/chats/${pair.users[0].username}/${pair.chats._id}`)} key={pair._id}>
                                    <td className=''>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-auto w-auto p-2">
                                                    <ProfilePicture imageData={pair.users[0].profilePicture.data} width='md:w-10 w-7' height="md:h-10 h-7" />
                                                </div>
                                            </div>
                                            <div className='relative'>
                                                <div className={`h-3 w-3 ${userStatuses[pair.users[0]._id]  === 'online' ? 'bg-green-500' : 'bg-slate-500'}  rounded-full absolute top-3 right-2`}></div>
                                            </div>
                                            {/* {userStatuses[pair.users[0]._id]} */}
                                            {/* {pair.users[0].status} */}
                                            <div>
                                                <div className="font-bold">{pair.users[0].firstname} {pair.users[0].lastname}</div>
                                                <div className="text-sm opacity-50">{pair.users[0].username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {pair.chats.messages.length > 0 ? (
                                            pair.chats.messages[pair.chats.messages.length - 1].content.slice(0,20)
                                        ): (<p>....</p>)}
                                    </td>

                                    <td>
                                        {pair.chats.messages.length > 0 ? (() => {
                                            const messageDate = new Date(pair.chats.messages[pair.chats.messages.length - 1].createdAt);
                                            const today = new Date();
                                            const yesterday = new Date();
                                            yesterday.setDate(today.getDate() - 1);

                                            // Format dates to YYYY-MM-DD for comparison
                                            const formattedMessageDate = messageDate.toISOString().slice(0, 10);
                                            const formattedToday = today.toISOString().slice(0, 10);
                                            const formattedYesterday = yesterday.toISOString().slice(0, 10);

                                            if (formattedMessageDate === formattedToday) {
                                                return "Today";
                                            } else if (formattedMessageDate === formattedYesterday) {
                                                return "Yesterday";
                                            } else {
                                                return formattedMessageDate;
                                            }
                                        })() : (<p>....</p>)}
                                    </td>

                                    <th>
                                        {pair.chats.messages.length > 0 ? (
                                            new Date(pair.chats.messages[pair.chats.messages.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        ) : (
                                            <p>....</p>
                                        )}
                                    </th>

                                </tr>

                            ))
                        }

                    </tbody>
                </table>
            </div>) :
                (<div className='flex justify-center items-center mt-20 w-full h-full'>
                    <div className=''>
                        <div role="alert" className="alert alert-info">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="h-6 w-6 shrink-0 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div className='flex gap-x-1 md:flex-row flex-col'>
                                <span>You haven't connected to any users</span>
                                <Link to={'/'} className='text-slate-800 underline'>connect with people</Link>
                            </div>
                        </div>
                    </div>
                </div>)
            }
        </div>
    )
}

export default Messages