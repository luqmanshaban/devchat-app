import React, { useEffect, useState } from 'react';
import ProfilePicture from '../../components/ProfilePicture';
import { loggedInUserDetails } from '../../state/LoggedInUser';
import axios from 'axios';
import Config from '../../../config';

const serverUrl = `${Config.serverUrl}/profile-pic/`

const Picture = () => {
    const user = loggedInUserDetails().user;
    const [newImg, setNewImg] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setErr] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [userProfileImage, setUserProfileImage] = useState([])
    

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            setNewImg(file);

            // Generate preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Clean up the URL after the image is loaded
            const output = document.getElementById('preview_img') as HTMLImageElement;
            output.onload = () => {
                URL.revokeObjectURL(url); // Free memory
            };
        }
    };

    useEffect(() => {
        async function getUserProfile() {
            try {
                const res = await axios.get(serverUrl + user?._id)
                setUserProfileImage(res.data.profilePicture.image.data)
            } catch (error) {
                console.error();
            }
        }
        getUserProfile()
    },[])


    const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData();
            if (newImg) {
                formData.append('profilePic', newImg); // Append the file with the field name 'profilePic'
            }
            await axios.post(serverUrl + user?._id, formData)
            setLoading(false)
            setSuccess(true)
            setNewImg(null)
            setTimeout(() => {
                setSuccess(false)
                window.location.reload()
            }, 5000);
        } catch (error) {
            console.error(error);
            setLoading(false)
            setErr(true)
            setErrorMessage('SERVER ERROR OCCURED')
            setTimeout(() => {
                setErr(false)
            }, 5000);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-slate-400'>Profile Picture</h2>
            <div className='flex items-center gap-4'>
                {newImg === null && (
                    <div>
                        <ProfilePicture imageData={userProfileImage} width='md:w-28 w-12' height="md:h-28 h-12" />
                    </div>
                )}

                <div>
                    <form onSubmit={uploadFile}>
                        <div className="flex items-center gap-4 space-x-6">
                            <div className="shrink-0">
                                {previewUrl && (
                                    <img
                                        id='preview_img'
                                        className=" w-12 md:w-20 object-cover rounded-full"
                                        src={previewUrl}
                                        alt="Preview of uploaded photo"
                                    />
                                )}
                            </div>
                            <label className="block">
                                <span className="sr-only">Choose profile photo</span>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-violet-50 file:text-violet-700
                                        hover:file:bg-violet-100"
                                />
                            </label>
                            {newImg !== null && <button className='p-3 rounded-lg bg-primary text-neutral w-auto'>
                                {!loading && <span>Save</span>}
                                {loading && <span className="loading loading-spinner loading-xs"></span>}
                            </button>}

                          {success &&  <div role="alert" className="alert">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-info h-6 w-6 shrink-0">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Image uploaded successfully</span>
                            </div>}

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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Picture;
