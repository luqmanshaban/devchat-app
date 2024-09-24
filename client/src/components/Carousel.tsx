import styles from './Carousel.module.css';
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import { loggedInUserDetails } from '../state/LoggedInUser';
import { UserC } from '../lib/types';
import axios from 'axios';
import ProfilePicture from './ProfilePicture';
import Config from '../../config';

const sliderVariants = {
    incoming: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        scale: 1.2,
        opacity: 0
    }),
    active: { x: 0, scale: 1, opacity: 1 },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
        scale: 1,
        opacity: 0.2
    })
}

const sliderTransition = {
    duration: 1,
    ease: [0.56, 0.03, 0.12, 1.04]
}

const serverUrl = Config.serverUrl;

const Carousel = () => {
    const user = loggedInUserDetails().user;
    const [[imageCount, direction], setImageCount] = useState([0, 0]);
    const [users, setUsers] = useState<UserC[]>([]);

    const activeImageIndex = wrap(0, users.length, imageCount);

    const swipeToImage = (swipeDirection: any) => {
        setImageCount([imageCount + swipeDirection, swipeDirection]);
    }

    const dragEndHandler = (dragInfo: any) => {
        const draggedDistance = dragInfo.offset.x;
        const swipeThreshold = 50;
        if (draggedDistance > swipeThreshold) {
            swipeToImage(-1);
        } else if (draggedDistance < -swipeThreshold) {
            swipeToImage(1);
        }
    }

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await axios.get(serverUrl + '/paired-users/non-paired/'+user?._id, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
                setUsers(res.data.users.filter((userX: UserC) => userX._id !== user?._id));  // Ensure res.data.users contains the correct array of user objects

            } catch (error) {
                console.error(error);
            }
        }

        getUsers();
    }, [user]);

    const sendConnectionRequest = async (recipientId: string) => {
        try {
            const res = await axios.post(serverUrl + '/connection-requests', {
                connectionRequest: {
                    senderId: user?._id,
                    recipientId: recipientId
                }
            })
            console.log(res);
            
        } catch (error) {
            console.error(error);

        }
    }

    return (
        <>
           { users.length > 0 ? (<div className={`flex flex-col gap-4 items-center h-auto md:mb-4 mb-20`}>
                <div className={styles.slider}>
                    <AnimatePresence initial={false} custom={direction}>
                        {users.length > 0 && (
                            <motion.div className={`${styles.image} card card-compact bg-base-100 w-96 shadow-xl`}
                                custom={direction}
                                variants={sliderVariants}
                                initial="incoming"
                                animate="active"
                                exit="exit"
                                transition={sliderTransition}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(_, dragInfo) => dragEndHandler(dragInfo)}
                                key={imageCount}
                            >
                                <figure className='h-[80%] bg-info/50'>
                                    <ProfilePicture imageData={users[activeImageIndex].profilePicture?.data} width={'md:w-36 w-16'} height={'md:h-36 h-16'} />
                                </figure>
                                <div className="card-body">
                                    <div className='flex justify-between'>
                                        <div>
                                            <h2 className="card-title">{users[activeImageIndex].firstname}</h2>
                                            <p>{users[activeImageIndex].title}</p>  {/* Assuming title exists */}
                                        </div>
                                        <div className="card- justify-end">
                                            <button className="btn btn-primary" onClick={() => sendConnectionRequest(users[activeImageIndex]._id)}>Connect</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={`${styles.buttons} flex`}>
                    <button disabled={activeImageIndex === 0} onClick={() => swipeToImage(-1)} className='flex items-center gap-3'>
                        <MdSkipPrevious />
                    </button>
                    <button disabled={activeImageIndex === users.length - 1} onClick={() => swipeToImage(1)}>
                        <MdSkipNext />
                    </button>
                </div>
            </div>) : (
                    <div role="alert" className="alert alert-info w-80">
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
                        <span>No users available for connection.</span>
                    </div>
            )}
        </>
    );
}

export default Carousel;
