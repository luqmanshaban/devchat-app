import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import Config from '../../../config'

const serverUrl = `${Config.serverUrl}/users/auth/request-password-reset`

const ResetPassword = () => {

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [showConfirmation, setshowConfirmation] = useState(false)
    const [email, setEmail] = useState('')


    const handleSubmitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(serverUrl, {email: email})
            setLoading(false)
            if (res.status === 400 || res.status == 404) {
                setError(true)
                setErrorMessage(res.data.error)
                setTimeout(() => setError(false), 3000)
            }
            setshowConfirmation(true)
        } catch (error) {
            console.error(error);
            setLoading(false)
            setError(true)
            setErrorMessage('A SERVER ERROR OCCURED')
            setTimeout(() => setError(false), 3000)
        }
    }


    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='w-80 flex justify-center items-center'>
                <div className='flex justify-center items-center flex-col gap-2 w-full'>
                    <div className="mb-10">
                        <Link to={'/login'} className="flex justify-center">
                            <Logo height={50} width={50} />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-400">
                            Reset Your Password
                        </h2>
                        {!showConfirmation && <p className="text-center text-s text-gray-500 mt-5">
                            Can't remember your password
                        </p>}
                    </div>

                    {!showConfirmation && <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmitLoginForm}>
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
                                <input type="email" className="grow" placeholder="Email" autoComplete='email' name='email' required onChange={(e) => setEmail(e.target.value)} />
                            </label>
                        </div>
                 
                        <div>
                            <button className='p-3 rounded-lg bg-primary text-neutral w-full'>
                                {!loading && <span>Reset password</span>}
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
                        <span>{errorMessage}</span>
                    </div>}
                
                    {
                        showConfirmation && (<div>
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
                                <span> Please check your email inbox for a link to complete the reset.</span>
                            </div>
                           
                        </div>)
                    }

                 
                </div>
            </div>
        </div>
    )
}

export default ResetPassword