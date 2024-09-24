import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Header({
    heading,
    paragraph,
    linkName,
    linkUrl
}: { heading: string, paragraph: string, linkName: string, linkUrl: string }) {
    return (
        <div className="mb-10">
            <Link to={'/login'} className="flex justify-center">
                <Logo height={50} width={50} />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-400">
                {heading}
            </h2>
            <p className="text-center text-s text-gray-500 mt-5">
                {paragraph} {' '}
                <Link to={linkUrl} className="font-medium text-purple-600 hover:text-purple-500">
                    {linkName}
                </Link>
            </p>
        </div>
    )
}