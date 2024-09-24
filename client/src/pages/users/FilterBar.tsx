
import { IoFilterOutline } from "react-icons/io5";

const FilterBar = ({ title, toggle }: { title: string, toggle: (index: number) => void }) => {
    return (
        <div>
            <section>
                <div className="navbar bg-base-100">
                    <div className="flex-1">
                        <p className="btn btn-ghost text-xl">{title}</p>
                    </div>
                    <div className="flex-none gap-2">
                        
                        <div className="dropdown dropdown-end">
                            <div className="dropdown">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                   <IoFilterOutline className="text-2xl"/>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li><button onClick={() => toggle(0)}>Connected</button></li>
                                    <li><button onClick={() => toggle(1)}>Requests</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FilterBar