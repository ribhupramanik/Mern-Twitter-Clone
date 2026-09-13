import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const {mutate, isError, isPending, error} = useMutation({
		mutationFn: async({email, username, fullName, password}) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({email, username, fullName, password}),
				});

				const data = await res.json();
				if(!res.ok) throw new Error(data.error || "Failed to create account");
				
				console.log(data);
				return data;

			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success('Account Created Successfully')
		}
	})
	

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='w-full min-w-0 max-w-7xl mx-auto flex min-h-dvh px-4 py-8 sm:px-8'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='min-w-0 flex-1 flex flex-col justify-center items-center'>
				<form className='w-full max-w-sm flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-3xl sm:text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex min-w-0 w-full items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='min-w-0 w-full grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<label className='input input-bordered rounded flex min-w-0 w-full items-center gap-2'>
							<FaUser />
							<input
								type='text'
								className='min-w-0 w-full grow'
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex min-w-0 w-full items-center gap-2'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='min-w-0 w-full grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex min-w-0 w-full items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='min-w-0 w-full grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Sign Up"} 
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='w-full max-w-sm flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;