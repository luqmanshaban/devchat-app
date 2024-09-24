import Messages from './Messages'
import Pageheader from '../../components/Pageheader'
import { loggedInUserDetails } from '../../state/LoggedInUser'
import { useEffect, useState } from 'react'
import { PairedUsersM } from '../../lib/types'
import axios from 'axios'
import Config from '../../../config'


const serverUrl = Config.serverUrl

const Chats = () => {
  const user = loggedInUserDetails().user
  const [pairedUsers, setPairedUsers] = useState<PairedUsersM[]>([])

  useEffect(() => {
    async function getPairedUsers() {
      try {
        const res = await axios.get(`${serverUrl}/paired-users/chats/${user?._id}`)
        if (res.status === 404) {
          console.error(res.data.message);
        }
        setPairedUsers(res.data.pairs)
      } catch (error) {
        console.error();

      }
    }

    getPairedUsers()
  },[])
  
  return (
    <div className="md:p-28 pt-20 p-3 h-screen">
      <div className="flex flex-col gap-y-4 border-b border-slate-500 pb-10 border-opacity-40">
        <div className='flex md:justify-between justify-start items-center md:flex-row flex-col-reverse'>
          <div className='hidden md:flex flex-col gap-y-4'>
            <h1 className='text-slate-500 md:text-5xl text-2xl'>Chats</h1>
          </div>
          <Pageheader link={'/chats'} text={'Chats'} />
        </div>
      </div>

      <section className='mt-10'>
        <Messages pairs={pairedUsers} />
      </section>
    </div>
  )
}

export default Chats