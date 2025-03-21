("use client");
import { Button } from "@/components/shadcn/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "@/axios/interceptors";
import { useEffect } from "react";
import useModalStore from "@/store/useModalStore";
import AddUser from "./AddUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Api_login } from "../utils/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../utils/schemas/Auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/shadcn/ui/form";
import useAuthStore from "@/store/useAuthStore";
import Cookies from "js-cookie";


const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
	const { openModal, content } = useModalStore();
	const navigate = useNavigate();
	const { setUserData, isAuthenticated  } = useAuthStore();


	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, navigate]);
	
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function handleClick() {
		toast.success("Event has been created.");
		openModal({
			Component: AddUser, // Pass the component
			title: "User Registration",
			description: "Fill out the form to create a new user account.",
		});
	}


	const mutation = useMutation({
		mutationFn: Api_login,
		onSuccess: (data) => {
			const { user, token } = data; 
			Cookies.set("token", token);
			setUserData(user, token)
			toast.success(data?.message || "Login successful!");
			form.reset();
			navigate("/dashboard");
		},
		onError: (error) => {
			console.error(error.error || error?.message || "Login failed. Please try again.");
		},
	});

	const handleLogin = async (data) => {
		const toastId = toast.loading("Logging in...");
		try {
			await mutation.mutateAsync(data);
		} catch (error) {
			toast.error(error.error || error?.message || "Login failed.");
		} finally {
			toast.dismiss(toastId);
		}
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-xl">Login</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleLogin)}>
									<div className="flex flex-col gap-6">
										{/* Email Field */}
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="abc@example.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Password Field */}
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<Input
															type="password"
															placeholder="••••••"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>



										<Link to="/forgot-password"
										className="ml-auto inline-block text-sm">
											Forgot your password?
										</Link>

										<Button
											type="submit"
											className="w-full"
											disabled={mutation.isPending}
										>
											Login
										</Button>
									</div>
									<div className="mt-4 text-center text-sm">
										Don&apos;t have an account?{" "}
										<Link to="/signup">
											<Button variant="link" size="none">
												Register
											</Button>
										</Link>
									</div>
									{/* <div className="mt-4 text-center text-sm">
										<div variant="link" size="none" onClick={handleClick}>
											Register
										</div>
									</div> */}
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
