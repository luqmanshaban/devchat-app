import { Link } from 'react-router-dom'

const Pageheader = ({ link, text }: { link: string, text: string }) => {
    return (
        <div className='flex'>
            <div className='text-lg flex items-center gap-1'>
                <p className='text-slate-300'>Dashboard</p>
                <p>/</p>
                <Link to={link} className='text-info'>{text}</Link>
            </div>
        </div>
    )
}

export default Pageheader