import Welcome from "../../components/home/Welcome"
import Users from "../../components/Users"



const Dashboard = () => {
  return (
    <div className="md:p-28 pt-20 p-3 h-screen">
      <div className="flex flex-col gap-y-4 border-b border-slate-500 pb-10 border-opacity-40">
        <Welcome />
      </div>
        <Users />
    </div>
  )
}

export default Dashboard