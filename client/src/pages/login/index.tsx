import React, { useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthSession } from '../../state/Auth'
import { loggedInUserDetails } from '../../state/LoggedInUser'
import Config from '../../../config'

const serverUrl = `${Config.serverUrl}/users/auth`

const Login = () => {
  const [user, setUser] = useState({
    username: '',
    password: ''
  })


  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [invalidCode, setInvalidCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const navigate = useNavigate()
  const authenticateUser = useAuthSession()
  const saveUserDetails = loggedInUserDetails()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(serverUrl, user)
      if (res.status === 400) {
        setErrorMessage(res.data.error)
        setTimeout(() => {
          setErrorMessage('')
        }, 3000)
      }
      setLoading(false)
      setShowVerificationForm(true)
    } catch (error) {
      console.error(error);
      setLoading(false)
      setError(true)
      setErrorMessage('A server error occured')
      setTimeout(() => {
        setError(false)
        setErrorMessage('')
      }, 3000)
    }
  }

  const handleCodeVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(serverUrl + '/verify-code', {code: verificationCode})
      if (res.status === 400) {
        setErrorMessage(res.data.error)
        setTimeout(() => {
          setInvalidCode(false)
          setErrorMessage('')
        }, 3000)
      }
      setLoading(false)
      setShowVerificationForm(true)
      setLoading(false)
      localStorage.setItem('token', res.data.token)
      authenticateUser.authenticate()
      saveUserDetails.setUser(res.data.user)
      navigate('/')
    } catch (error) {
      console.error(error);
      setError(true)
      setLoading(false)
      setErrorMessage('A SERVER ERROR OCCURED')
      setTimeout(() => {
        setError(false)
        setErrorMessage('')
      }, 3000)
    }
  }
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='w-80 flex justify-center items-center'>
        <div className='flex justify-center items-center flex-col gap-2 w-full'>
          <Header
            heading="Login to your account"
            paragraph="Don't have an account yet? "
            linkName="Signup"
            linkUrl="/signup"
          />

          {!showVerificationForm && <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmitLoginForm}>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="Username" name='username' required onChange={handleChange} />
              </label>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input type="password" className="grow" placeholder='password' name='password' required onChange={handleChange} />
              </label>
            </div>
            <div>
            <div className='flex justify-between items-center my-1'>
              <p></p>
              <Link to={'/reset-password'} className='text-info underline text-sm'>Forgot your password?</Link>
            </div>
              <button className='p-3 rounded-lg bg-primary text-neutral w-full'>
                {!loading && <span>Login</span>}
                {loading && <span className="loading loading-spinner loading-xs"></span>}
              </button>
            </div>
          </form>}

         {error && <div role="alert" className="alert alert-error text-center flex justify-center">
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
            <span className='lowercase'>{errorMessage}</span>
          </div>}
         
         {invalidCode && <div role="alert" className="alert alert-error text-center flex justify-center">
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
            <span>Invalid code</span>
          </div>}

          {showVerificationForm && <form className='flex flex-col gap-4 w-full' onSubmit={handleCodeVerification}>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                {/* <DiGit /> */}
                <input type="text" className="grow text-center" placeholder="verification code" name='code' required onChange={(e) => setVerificationCode(e.target.value)} />
              </label>
            </div>
            <div>
              <button className='p-3 rounded-lg bg-primary text-neutral w-full'>
                {!loading && <span>Verify</span>}
                {loading && <span className="loading loading-spinner loading-xs"></span>}
              </button>
            </div>
          </form>}
        </div>
      </div>
    </div>
  )
}

export default Login