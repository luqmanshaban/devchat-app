import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CiHome } from "react-icons/ci";
import { IoChatbubblesOutline } from "react-icons/io5";
import { PiUsersDuotone } from "react-icons/pi";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuthSession } from '../state/Auth';


const Sidebar = ({ toggle }: { toggle: () => void }) => {
    const updateSession = useAuthSession()
    const navigate = useNavigate()

    const Logout = () => {
        updateSession.logout()
        localStorage.clear()
        navigate('/login')
    }

    const pathname = useLocation().pathname
    return (
        <>
            <div className=' md:hidden bg-slate-400 bg-opacity-40 fixed h-full w-full block z-10' onClick={toggle}></div>
            <div className='h-full fixed pt-20 pb-10 bg-neutral z-20 flex flex-col justify-between items-center'>
                <ul className="menu bg-neutral shadow h-full flex flex-col gap-y-4">
                    <li>
                        <Link to={'/'} className={`${pathname === '/' && 'text-info bg-slate-700'} tooltip tooltip-right`} data-tip="Home">
                            <CiHome className='text-2xl font-semibold text' />
                        </Link>
                    </li>
                    <li>
                        <Link to={'/chats'} className={`${pathname === '/chats' && 'text-info bg-slate-700'} tooltip tooltip-right`} data-tip="Chats">
                            <IoChatbubblesOutline className='text-2xl font-semibold text' />
                        </Link>
                    </li>
                    <li>
                        <Link to={'/users'} className={`${pathname === '/users' && 'text-info bg-slate-700'} tooltip tooltip-right`} data-tip="Users">
                            <PiUsersDuotone className='text-2xl font-semibold text' />
                        </Link>
                    </li>

                </ul>
                <ul>
                    <li>
                        <button onClick={Logout} className={` tooltip tooltip-right text-warning`} data-tip="Logout">
                            <AiOutlineLogout className='text-2xl font-semibold text' />
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar