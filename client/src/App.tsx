
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Signup from './pages/signup'
import Chats from './pages/chats'
import Users from './pages/users'
import Profile from './pages/profile'
import Dashboard from './pages/dashboard'
import { useAuthSession } from './state/Auth'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { useEffect, useState } from 'react'
import { loggedInUserDetails } from './state/LoggedInUser'
import UserProfile from './pages/users/profile'
import ChatMessage from './pages/chats/chat'
import { io } from 'socket.io-client'
import ResetPassword from './pages/reset-password'
import NewPassword from './pages/reset-password/new-password'
import Protected from './Protected'
import PageTitle from './components/PageTitle'
import Config from '../config'

const socket = io(Config.socketUrl)

function App() {
  const authSession = useAuthSession()
  const user = loggedInUserDetails()

  const [showSidebar, setShowSidebar] = useState(true)

  const toggleSidebar = () => setShowSidebar(!showSidebar)


  // Setup socket connection when the user is authenticated
  useEffect(() => {
    if (authSession.isAuth && socket) {
      // Notify the server that this user is online
      socket.emit('user-online', user?.user?._id);

      // Optionally, update status in the local state/store
      user.updateStatus('online');

      // Handle when the user disconnects or leaves the app
      const handleDisconnect = () => {
        socket.emit('user-offline', user?.user?._id); // Notify server the user is offline
        user.updateStatus('offline');
      };

      // Listen for socket disconnection and manually emit 'user-offline'
      socket.on('disconnect', handleDisconnect);

      // Cleanup on unmount (component unmount or user logout)
      return () => {
        socket.emit('user-offline', user?.user?._id); // Explicitly notify server
        socket.disconnect(); // Disconnect socket
        socket.off('disconnect', handleDisconnect); // Remove event listener
      };
    }
  }, [authSession.isAuth, socket, user]);



  return (
    <>
      <div className={`${!authSession.isAuth ? 'hidden' : 'block fixed h-full w-auto z-50'}`}>
        <Navbar toggle={toggleSidebar} sidebarActive={showSidebar} />
        {showSidebar && <Sidebar toggle={toggleSidebar} />}
      </div>
      <Routes>
        <Route path='/login' element={
          <>
            <PageTitle title="Login | Devchat" />
            <Login />
          </>
        } />
        <Route path='/signup' element={
          <>
            <PageTitle title="Sign Up | Devchat" />
            <Signup />
          </>
        } />
        <Route path='/reset-password' element={
          <>
            <PageTitle title="Reset Password | Devchat" />
            <ResetPassword />
          </>
        } />
        <Route path='/new-password' element={
          <>
            <PageTitle title="Set New Password | Devchat" />
            <NewPassword />
          </>
        } />
        <Route path='/' element={
          <Protected>
            <PageTitle title="Dashboard | Devchat" />
            <Dashboard />
          </Protected>
        } />
        <Route path='/chats' element={
          <Protected>
            <PageTitle title="Chats | Devchat" />
            <Chats />
          </Protected>
        } />
        <Route path='/chats/:username/:id' element={
          <Protected>
            <PageTitle title="Chat with User | Devchat" />
            <ChatMessage />
          </Protected>
        } />
        <Route path='/users' element={
          <Protected>
            <PageTitle title="Users | Devchat" />
            <Users />
          </Protected>
        } />
        <Route path='/users/:username' element={
          <Protected>
            <PageTitle title="User Profile | Devchat" />
            <UserProfile />
          </Protected>
        } />
        <Route path='/profile' element={
          <Protected>
            <PageTitle title="Your Profile | Devchat" />
            <Profile />
          </Protected>
        } />
      </Routes>

    </>
  )
}

export default App
