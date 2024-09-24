import Carousel from './Carousel'

const Users = () => {
    return (
        <div className='w-full flex justify-center items-center mt-10 z-20'>
            <section className='flex justify-between items-center md:flex-row flex-col gap-5 w-full z-10'>
                <div className='flex flex-col gap-4 px-5 md:mb-4'>
                    <h2 className='text-2xl text-slate-200 font-semibold'>Connect to Users</h2>
                    <p className='text-sm text-slate-500'>Send connection requests to start messaging users</p>
                </div>
                <Carousel />
            </section>
        </div>
    )
}

export default Users