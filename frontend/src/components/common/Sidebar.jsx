import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const queryClient = useQueryClient()

	const {mutate:logout} = useMutation({
		mutationFn: async() => {
			try {
				const res = await fetch("/api/auth/logout",{
					method: "POST",
				})
				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: ()=>{
			queryClient.invalidateQueries({queryKey:['authUser']})
		},
		onError: () => {
			toast.error("Logout failed")
		}
	})
	const {data:authUser} = useQuery({queryKey: ['authUser']})

	return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-700 bg-base-100 pb-[env(safe-area-inset-bottom)] sm:static sm:w-20 sm:shrink-0 sm:border-t-0 sm:pb-0 lg:w-52">
      <nav aria-label="Main navigation" className="flex min-h-16 items-center px-2 sm:sticky sm:top-0 sm:h-dvh sm:flex-col sm:items-stretch sm:overflow-y-auto sm:border-r sm:border-gray-700 sm:py-2">
        <Link to="/" aria-label="Home" className="hidden justify-center sm:flex lg:justify-start">
          <XSvg className="h-12 w-12 rounded-full fill-white p-2 hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-1 items-center justify-around gap-1 sm:mt-4 sm:flex-none sm:flex-col sm:items-stretch sm:gap-3">
          {[
            { to: '/', label: 'Home', icon: <MdHomeFilled className="h-6 w-6 shrink-0" /> },
            { to: '/notifications', label: 'Notifications', icon: <IoNotifications className="h-6 w-6 shrink-0" /> },
            { to: `/profile/${authUser?.username}`, label: 'Profile', icon: <FaUser className="h-6 w-6 shrink-0" /> },
          ].map(({ to, label, icon }) => (
            <li key={label} className="flex justify-center lg:justify-start">
              <Link to={to} aria-label={label} className="flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full p-2 transition-colors hover:bg-stone-900 lg:px-3">
                {icon}
                <span className="hidden text-lg lg:block">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        {authUser && (
          <div className="flex items-center gap-1 sm:mt-auto sm:py-2">
            <Link to={`/profile/${authUser.username}`} className="hidden min-w-0 flex-1 items-center gap-2 rounded-full p-2 hover:bg-stone-900 lg:flex">
              <img className="h-8 w-8 shrink-0 rounded-full object-cover" src={authUser.profileImg || '/avatar-placeholder.png'} alt="Your profile" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{authUser.fullName}</p>
                <p className="truncate text-sm text-slate-500">@{authUser.username}</p>
              </div>
            </Link>
            <button type="button" aria-label="Log out" title="Log out" onClick={() => logout()} className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-stone-900">
              <BiLogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};
export default Sidebar;
