import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Pageheader from '../../../components/Pageheader'
import { UserC } from '../../../lib/types'
import axios from 'axios'
import ProfilePicture from '../../../components/ProfilePicture'
import { loggedInUserDetails } from '../../../state/LoggedInUser'
import Config from '../../../../config'

interface ImageBuffer {
    image: {
        data: number[]
    }
}

const server_url = Config.serverUrl;


const UserProfile = () => {
    let { username } = useParams()
    const loggedInUser = loggedInUserDetails()

    const [user, setUser] = useState<UserC>()
    const [profilePic, setProfilePic] = useState<ImageBuffer>()
    const [chatId, setChatId] = useState('')

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get(`${server_url}/users/username/${username}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })

                setUser(res.data.user)
                setProfilePic(res.data.profilePicture)
                await getMessages(res.data.user._id)
            } catch (error) {
                console.error(error);

            }
        }

        async function getMessages(user1Id: string) {
            try {
                const chatId = (await axios.post(`${server_url}/chats`, { user1Id: user1Id, user2Id: loggedInUser.user?._id})).data.chatId;
                setChatId(chatId);
                
            } catch (error) {
                console.error(error);
            }
        }

        getUser()
    }, [])

    return (
        <div className='md:p-28 pt-20 p-3 h-screen'>
            <div className="flex flex-col gap-y-4 border-b border-slate-500 pb-10 border-opacity-40">
                <div className='flex md:justify-between justify-start items-center md:flex-row flex-col-reverse'>
                    <div className='hidden md:flex flex-col gap-y-4'>
                        <h1 className='text-slate-500 md:text-5xl text-2xl'>{username}</h1>
                    </div>
                    <Pageheader link={'/users'} text={'users'} />
                </div>
            </div>
            <div className='mt-20'>
                <div className="card md:card-side card-normal bg-base-100 shadow-xl md:h-[300px] h-auto">
                    <figure className='h-full bg-info/50 w-full md:w-[300px] flex justify-center items-center'>
                        <div className='flex justify-center items-center p-3'>
                            <ProfilePicture imageData={profilePic?.image.data || []} width={'md:w-36 w-44'} height={'md:h-36 h-44'} />
                        </div>
                    </figure>
                    <div className="card-body mt-4">
                        <h2 className="card-title">{user?.firstname} {user?.lastname}</h2>
                        <h3 className='text-info/75'>{user?.title}</h3>
                        <div className='my-4'>
                            <p className='text-lg text-slate-400'>Bio</p>
                            <p>{user?.about}</p>
                        </div>
                        <div className="card-actions justify-start">
                            <Link to={`/chats/${user?.username}/${chatId}`}  className="btn btn-primary">Message</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile