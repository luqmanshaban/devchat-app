import React, { useState } from 'react'
import axios from 'axios'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import Config from '../../../config'

const serverUrl = `${Config.serverUrl}/users`

const Signup = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
  })

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitSignupForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(serverUrl, user)
      setLoading(false)

      if (res.status === 400) {
        setErrorMessage(res.data.error)
      }
      else {
        navigate('/login')
      }

    } catch (error) {
      console.error(error);
      setLoading(false)
      setError(true)
      setTimeout(() => setError(false), 5000)
      setErrorMessage('A server error occured')
    }
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='w-80 flex justify-center items-center'>
        <div className='flex justify-center items-center flex-col gap-2 w-full'>
          <Header
            heading="Create your account"
            paragraph="Already have an account? "
            linkName="Login"
            linkUrl="/login"
          />

          <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmitSignupForm}>
            <div>
              <input type="text" placeholder="First Name" onChange={handleChange} autoComplete='first name' name='firstname' required className="input input-bordered w-full max-w-xs" />
            </div>
            <div>
              <input type="text" placeholder="Last Name" onChange={handleChange} autoComplete='last name' name='lastname' required className="input input-bordered w-full max-w-xs" />
            </div>
           
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path
                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="email" className="grow" placeholder="Email" autoComplete='email' name='email' required onChange={handleChange}/>
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
                <input type="password" className="grow" name='password' placeholder='password' required onChange={handleChange} />
              </label>
            </div>
            <div>
              <button className='p-3 rounded-lg bg-primary text-neutral w-full'>
                {!loading && <span>Signup</span>}
                {loading && <span className="loading loading-spinner loading-xs"></span> }
              </button>
            </div>
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
              <span>{errorMessage}</span>
            </div>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup