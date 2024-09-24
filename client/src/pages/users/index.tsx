import { useEffect, useState } from 'react'
import Pageheader from '../../components/Pageheader'
import ConnectedUsers from './connectedUsers'
import FilterBar from './FilterBar'
import { ConnectionRequestT, PairedUsersT } from '../../lib/types'
import axios from 'axios'
import { loggedInUserDetails } from '../../state/LoggedInUser'
import Requests from './Requests'
import Config from '../../../config'

const serverUrl = Config.serverUrl

const Users = () => {
  const user = loggedInUserDetails().user
  const [pairedUsers, setPairedUsers] = useState<PairedUsersT[]>([])
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequestT[]>([])

  // You can add booleans to the state if you have multiple filters
  const [renderComponent, setRenderComponent] = useState([true, false])

  const toggleComponent = (index: number) =>
    setRenderComponent(prev => prev.map((_, i) => i === index));


  useEffect(() => {    
    async function getPairedUsers() {
      try {
        const res = await axios.get(`${serverUrl}/paired-users/${user?._id}`)
        if (res.status === 404) {
          console.error(res.data.message);
        }
        setPairedUsers(res.data.pairs)
        
      } catch (error) {
        console.error();
        
      }
    }
    async function getConnectionRequests() {
      try {
        const res = await axios.get(`${serverUrl}/connection-requests/${user?._id}`)
        if (res.status === 404) {
          console.error(res.data.message);
        }
        setConnectionRequests(res.data.requests)
        
      } catch (error) {
        console.error();
        
      }
    }

    getPairedUsers()
    getConnectionRequests()
  }, [])
  
  return (
    <div className="md:p-28 pt-20 p-3 h-screen">

      <div className="flex flex-col gap-y-4 border-b border-slate-500 pb-10 border-opacity-40">
        <div className='flex md:justify-between justify-start items-center md:flex-row flex-col-reverse'>
          <div className='hidden md:flex flex-col gap-y-4'>
            <h1 className='text-slate-500 md:text-5xl text-2xl'>Users</h1>
          </div>
          <Pageheader link={'/users'} text={'Users'} />
        </div>
      </div>
      
      <section>
        <FilterBar title={renderComponent[0] ? 'Connected' : 'Requests'} toggle={toggleComponent} />
        {renderComponent[0] && <ConnectedUsers pairs={ pairedUsers } />}
        {renderComponent[1] && <Requests requests={ connectionRequests } />}
      </section>
    </div>
  )
}

export default Users