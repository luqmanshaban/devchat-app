import { loggedInUserDetails } from '../../state/LoggedInUser'
import Pageheader from '../Pageheader'

const Welcome = () => {
    const user = loggedInUserDetails().user
    return (
        <div className='flex md:justify-between justify-start items-center md:flex-row flex-col-reverse'>
            <div className='hidden md:flex flex-col gap-y-4'>
                <h2 className='text-info text-xl'>Welcome Back!</h2>
                <h1 className='text-slate-500 md:text-5xl text-2xl'>{user?.firstname} {user?.lastname}</h1>
                {/* <p className='text-md text-slate-400'>Your ultimate messaging web app</p> */}
            </div>
            <Pageheader link={'/'} text={'Home'} />
        </div>
    )
}

export default Welcome