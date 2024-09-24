import React, { useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../../components/Logo'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Config from '../../../../config';

const serverUrl = `${Config.serverUrl}/users/auth/reset-password`

const NewPassword = () => {
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false) // New state to toggle password visibility
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')
    console.log(token)

    const handleSubmitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(serverUrl, { token: token, newPassword: password })
            setLoading(false)
            if (res.status === 400 || res.status === 404) {
                setError(true)
                setErrorMessage(res.data.error)
                setTimeout(() => setError(false), 3000)
            }
            navigate('/login')
        } catch (error) {
            console.error(error)
            setLoading(false)
            setError(true)
            setErrorMessage('A SERVER ERROR OCCURED')
            setTimeout(() => setError(false), 3000)
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-80 flex justify-center items-center">
                <div className="flex justify-center items-center flex-col gap-2 w-full">
                    <div className="mb-10">
                        <Link to={'/login'} className="flex justify-center">
                            <Logo height={50} width={50} />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-400">
                            Reset Your Password
                        </h2>
                        <p className="text-center text-s text-gray-500 mt-5">
                            Can't remember your password
                        </p>
                    </div>

                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmitLoginForm}>
                        <div className="relative">
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
                                <input
                                    type={showPassword ? 'text' : 'password'} // Conditionally render input type
                                    className="grow"
                                    placeholder="New password"
                                    name="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2">
                                    {showPassword ? (
                                        <FaRegEyeSlash className='text-lg' />
                                    ) : (
                                        <FaRegEye className='text-lg' />
                                    )}
                                </button>
                            </label>
                        </div>

                        <div>
                            <button className="p-3 rounded-lg bg-primary text-neutral w-full">
                                {!loading && <span>Update Password</span>}
                                {loading && <span className="loading loading-spinner loading-xs"></span>}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div role="alert" className="alert alert-error text-center flex justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 shrink-0 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewPassword
