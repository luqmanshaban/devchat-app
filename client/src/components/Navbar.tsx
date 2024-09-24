import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { IoClose } from "react-icons/io5";
import ProfilePicture from "./ProfilePicture";
import { loggedInUserDetails } from "../state/LoggedInUser";
import axios from "axios";
import { useState, useEffect } from "react";
import Config from "../../config";

const serverUrl = `${Config.serverUrl}/profile-pic/`

const Navbar = ({ toggle, sidebarActive }: { toggle: () => void, sidebarActive: boolean }) => {
    const user = loggedInUserDetails().user
    const [userProfileImage, setUserProfileImage] = useState([])

    useEffect(() => {
        async function getUserProfile() {
            try {
                const res = await axios.get(serverUrl + user?._id)
                setUserProfileImage(res.data.profilePicture.image.data)
            } catch (error) {
                console.error();
            }
        }
        getUserProfile()
    }, [])

    return (
        <div className='fixed top-0 w-full h-auto bg-neutral z-[60] px-1'>
            <div className="navbar bg-neutral md:px-5">
                <div className="navbar-start cursor-pointer">
                    <button className=' md:hidden block z-[60]' onClick={toggle}>
                        {sidebarActive ? <IoClose className='text-2xl' /> : <HiOutlineMenuAlt2 className='text-2xl' />}
                    </button>
                    <Link to='/'>
                        <Logo height={20} width={20} />
                    </Link>
                </div>
                <div className="navbar-end">
                    <Link to={'/profile'} className="dropdown dropdown-end">
                        <ProfilePicture imageData={userProfileImage} width='md:w-10 w-7' height="md:h-10 h-7" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar