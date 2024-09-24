import { Link } from 'react-router-dom'
import { PairedUsersT } from '../../lib/types'
import ProfilePicture from '../../components/ProfilePicture'
import { BiEdit } from 'react-icons/bi'


const ConnectedUsers = ({ pairs }: { pairs: PairedUsersT[] }) => {


    return (
        <div className='flex justify-start items-start flex-col gap-4 md:w-full mt-10'>

            {pairs.length > 0 ? (<div className="overflow-x-auto w-full">
                <table className="table">
                    {/* head */}
                    <thead className=''>
                        <tr className=''>
                            <th>User</th>
                            <td>Title</td>
                            <th>Date</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {
                            pairs.map(pair => (
                                <tr className='transition ease-in-out duration-500 hover:bg-neutral/50' key={pair._id}>
                                    <td className=''>
                                        <Link to={pair.users[0].username} className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-auto w-auto p-2">
                                                    <ProfilePicture imageData={pair.users[0].profilePicture.data} width='md:w-10 w-7' height="md:h-10 h-7" />
                                                </div>
                                            </div>
                                            <div className='relative'>
                                                <div className='h-3 w-3 bg-green-500 rounded-full absolute top-3 right-0'></div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{pair.users[0].firstname} {pair.users[0].lastname}</div>
                                                <div className="text-sm opacity-50">{pair.users[0].username}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>{ pair.users[0].title}</td>
                                    <td>{pair.createdAt.slice(0, 10)}</td>
                                    <td>
                                        <Link to={'/chats/' + pair.users[0].username + '/'+pair.chats}>
                                            <BiEdit className='text-2xl text-info'/>
                                        </Link>
                                    </td>
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

export default ConnectedUsers