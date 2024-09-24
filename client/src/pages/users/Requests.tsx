import { Link, useNavigate } from 'react-router-dom'
import { ConnectionRequestT } from '../../lib/types'
import ProfilePicture from '../../components/ProfilePicture'
import { useState } from 'react'
import axios from 'axios'
import Config from '../../../config'

const serverUrl = `${Config.serverUrl}/connection-requests`

const Requests = ({ requests }: { requests: ConnectionRequestT[] }) => {
    const navigate = useNavigate()

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    
    const acceptRequest = async (requestId: string, username: string) => {
        try {
            const res = await axios.post(serverUrl + '/accept/' + requestId)
            if (res.status === 400) {
                setError(true)
                setErrorMessage(res.data.error)
                setTimeout(() => {
                    setError(false)
                }, 5000);
            } 
            navigate('/users/'+username)
        } catch (error) {
            console.error(error);
            setError(true)
            setErrorMessage('A SERVER ERROR OCCURED')
            setTimeout(() => {
                setError(false)
            }, 5000);
        }
    }


    return (
        <div className='flex justify-start items-start flex-col gap-4 md:w-full mt-10 relative'>

            {error && <div className='absolute z-10 -top-10'>
                <div role="alert" className="alert alert-error text-center flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{ errorMessage}</span>
                </div>
            </div>}

            {requests.filter(request => request.status !== 'accepted').length > 0 ? (<div className="overflow-x-auto w-full">
                <table className="table">
                    {/* head */}
                    <thead className=''>
                        <tr className=''>
                            <th>User</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {requests.filter(request => request.status !== 'accepted').map(request => (
                            <tr key={request._id} className='transition ease-in-out duration-500 hover:bg-neutral/50'>
                                <td className=''>
                                    <Link to={request.senderId.username} className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-fit w-fit p-2">
                                                <ProfilePicture imageData={request.profilePicture.data} width='md:w-10 w-7' height="md:h-10 h-7"/>
                                            </div>
                                        </div>
                                        <div className='relative'>
                                            <div className='h-3 w-3 bg-green-500 rounded-full absolute top-3 right-0'></div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{request.senderId.firstname} { request.senderId.lastname}</div>
                                            <div className="text-sm opacity-50">{request.senderId.username}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td>{request.createdAt.slice(0, 10)}</td>
                                <td>
                                    <button onClick={() => acceptRequest(request._id, request.senderId.username)} className='bg-info/70 hover:bg-info hover:text-neutral transition ease-in-out duration-500 p-2 rounded-lg'>Accept</button>
                                </td>
                            </tr>   
                        ))}
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
                                <span>You do not have any requests</span>
                            </div>
                        </div>
                    </div>
                </div>)

            }
        </div>
    )
}

export default Requests