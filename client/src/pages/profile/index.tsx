
import Pageheader from '../../components/Pageheader'
import Picture from './picture'
import ProfileInfo from './ProfileInfo'

const Profile = () => {
  return (
    <div className="md:p-28 pt-20 p-3">

      <div className="flex flex-col gap-y-4 border-b border-slate-500 pb-10 border-opacity-40">
        <div className='flex md:justify-between justify-start items-center md:flex-row flex-col-reverse'>
          <div className='hidden md:flex flex-col gap-y-4'>
            <h1 className='text-slate-500 md:text-5xl text-2xl'>Profile</h1>
          </div>
          <Pageheader link={'/profile'} text={'Profile'} />
        </div>
      </div>

      <section className='mt-10'>
        <Picture />
      </section>
      
      <section className='mt-10'>
        <ProfileInfo />
      </section>
    </div>
  )
}

export default Profile