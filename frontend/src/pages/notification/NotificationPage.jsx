import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import toast from "react-hot-toast";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useQuery, useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const {data:notifications, isLoading} = useQuery({
	queryKey: ["notifications"],
	queryFn: async() => {
		try {
			const res = await fetch("/api/notifications");
			const data = await res.json();
			if(!res.ok) throw new Error(data.error || "Something went wrong")
			return data
		} catch (error) {
			throw new Error(error)
		}
	},
  });

  const { mutate: deleteNotifications} = useMutation({
	mutationFn: async() => {
		try {
			const res = await fetch("/api/notifications", {
				method: "DELETE",
			});
			const data = await res.json();

			if(!res.ok) throw new Error(data.error || "Something went wrong")
			return data
		} catch (error) {
			throw new Error(error)
		}
	},
	onSuccess: () => {
		toast.success("Notification deleted successfully");
		queryClient.invalidateQueries({queryKey: ["notifications"]})
	},
	onError: (error) => {
		toast.error(error.message)
	}
  })

  return (
    <>
      <div className="min-w-0 flex-1 border-r border-gray-700 min-h-dvh">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" aria-label="Notification settings" className="flex h-11 w-11 items-center justify-center">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 shrink-0 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 shrink-0 text-red-500" />
              )}
              <Link className="min-w-0" to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="block">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
