import React, { useEffect, useState } from 'react';
import { loggedInUserDetails } from '../../state/LoggedInUser';
import axios from 'axios';
import Config from '../../../config';

const serverUrl = `${Config.serverUrl}/users/`;

const ProfileInfo = () => {
    const user = loggedInUserDetails().user;

    const [updatedUser, setUpdateUser] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        title: user?.title || '',
        about: user?.about || '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModified, setIsModified] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateUser(prev => ({ ...prev, [name]: value }));
    };

    const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdateUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        setSuccess(false);

        const updatedData = {
            firstname: updatedUser.firstname || user?.firstname,
            lastname: updatedUser.lastname || user?.lastname,
            email: updatedUser.email || user?.email,
            title: updatedUser.title || user?.title,
            about: updatedUser.about || user?.about,
        };

        

        try {
            const res = await axios.put(serverUrl + user?._id, { updatedData: updatedData }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            setLoading(false);

            if (res.status === 400) {
                setError(true);
                setErrorMessage(res.data.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            }
        } catch (error) {
            setLoading(false);
            setError(true);
            setErrorMessage('A server error occurred');
            setTimeout(() => {
                setError(false);
            }, 5000);
        }
    };

    useEffect(() => {
        const checkIfModified = updatedUser.firstname !== user?.firstname ||
            updatedUser.lastname !== user?.lastname ||
            updatedUser.email !== user?.email ||
            updatedUser.title !== user?.title ||
            updatedUser.about !== user?.about;

        setIsModified(checkIfModified);
    }, [updatedUser, user]);

    return (
        <div>
            <h2 className='text-slate-400'>Profile Info</h2>
            <div className='flex flex-col gap-4'>
                <form className='flex flex-col gap-4 mt-5 md:w-auto w-full' onSubmit={handleSubmit}>
                    <div className='flex md:items-center items-start md:flex-row flex-col gap-4 md:w-fit'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label htmlFor="firstname">Firstname</label>
                            <input
                                type="text"
                                name='firstname'
                                onChange={handleInputChange}
                                value={updatedUser.firstname}  // Use value instead of defaultValue
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label htmlFor="lastname">Lastname</label>
                            <input
                                type="text"
                                name='lastname'
                                onChange={handleInputChange}
                                value={updatedUser.lastname}  // Use value instead of defaultValue
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>
                    </div>
                    <div className='flex md:items-center md:flex-row flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name='email'
                                onChange={handleInputChange}
                                value={updatedUser.email}  // Use value instead of defaultValue
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="Title">Title</label>
                            <input
                                type="text"
                                name='title'
                                onChange={handleInputChange}
                                value={updatedUser.title}  // Use value instead of defaultValue
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="about">About</label>
                        <textarea
                            className="textarea textarea-bordered md:w-[400px] w-80 h-32"
                            onChange={handleTextAreaInput}
                            name='about'
                            value={updatedUser.about}  // Use value instead of defaultValue
                            placeholder="Bio"
                        />
                    </div>
                    <div>
                        <button
                            disabled={!isModified || loading}
                            className={`p-3 rounded-lg ${isModified ? 'bg-primary' : 'bg-primary/40'} text-neutral w-auto`}
                        >
                            {!loading && <span>Update</span>}
                            {loading && <span className="loading loading-spinner loading-xs"></span>}
                        </button>
                    </div>
                    {success && (
                        <div role="alert" className="alert">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="stroke-info h-6 w-6 shrink-0">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Profile Updated successfully</span>
                        </div>
                    )}
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
                </form>
            </div>
        </div>
    );
};

export default ProfileInfo;
