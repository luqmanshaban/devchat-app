import logo from '../assets/logo.webp'

const Logo = ({ height, width }: { height: number, width: number }) => {
  return (
    <div className='flex items-center gap-2 w-auto md:ml-0 ml-10'>
      <img src={logo} alt="logo" loading='lazy' height={height} width={width} />
      <p>DevChat</p>
    </div>
  )
}

export default Logo