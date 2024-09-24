import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Pageheader from '../../../components/Pageheader'
import MessageComponent from './chatMessage'


const ChatMessage = () => {
    let { username, id } = useParams()

    
    useEffect(() => {
        

    }, [])

    return (
        <div className='md:p-28 pt-20 p-3 h-screen'>
            <div className="flex flex-col gap-y-4 border-b border-slate-500 pb-10 border-opacity-40">
                <div className='flex md:justify-between justify-start items-center md:flex-row flex-col-reverse'>
                    <div className='hidden md:flex flex-col gap-y-4'>
                        <h1 className='text-slate-500 md:text-5xl text-2xl'>{username}</h1>
                    </div>
                    <Pageheader link={'/chats'} text={'messages'} />
                </div>
            </div>

            <MessageComponent id={id as string} username={username as string} />
        </div>
    )
}

export default ChatMessage