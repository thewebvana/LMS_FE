import { Button } from "@/components/shadcn/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm  } from "react-hook-form";
import { principalSchema } from "../utils/schemas/Auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/shadcn/ui/form";
import { useEffect } from "react";
import { registerUser } from "../utils/services/auth";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // If using React Router
export default function Signup() {

	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(principalSchema),
		defaultValues: {
			full_name: "",
			email: "",
			mobile: "",
			password: "",
			confirmPassword: "",
		},
	});

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
			// queryClient.invalidateQueries(["getAllUsers"]);
		},
		onError: (error) => {
			console.error("mutation error", error.message);
		},
	});

	const onSubmit = async (data) => {
		delete data.confirmPassword;
		let payload = {
			...data,
			role_id: 1,
		};
	
		try {
			toast.loading("Registering..."); // Show loading toast
			const response = await mutation.mutateAsync(payload);
			toast.dismiss();
			toast.success(response?.message || "Registered successfully!");
			form.reset();
			navigate("/login"); // Adjust the route as needed
		} catch (error) {
			toast.dismiss(); // Remove the loading toast
			toast.error(error.message || "Something went wrong!");
		}
	};
	

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-2xl">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-xl">Register</CardTitle>
							<CardDescription>Create a new principal account</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex flex-col gap-6"
								>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{/* full_name Field */}
										<FormField
											control={form.control}
											name="full_name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Name</FormLabel>
													<FormControl>
														<Input placeholder="Your name" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

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
										{/* mobile Field */}
										<FormField
											control={form.control}
											name="mobile"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Mobile</FormLabel>
													<FormControl>
														<Input
															type="mobile"
															placeholder="123456789"
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

										{/* Confirm Password Field */}
										<FormField
											control={form.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Confirm Password</FormLabel>
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
									</div>
									{/* Submit Button */}
									<Button
										type="submit"
										className="w-full"
										disabled={mutation.isPending}
									>
										Register
									</Button>
								</form>
							</Form>

							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<Link to="/">
									<Button variant="link" size="none">
										Login
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
