import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { principalSchema } from "../utils/schemas/Auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { getAllUsers, registerUser } from "../utils/services/auth";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Signup() {

	const queryClient = useQueryClient();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["getAllUsers"],
		queryFn: getAllUsers,
	  });


	  console.log("data", data)
	  console.log("isLoading", isLoading)
	//   console.log("isError", isError)
	//   console.log("error", error)

	const form = useForm({
		resolver: zodResolver(principalSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});


	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
		  // Option 1: Refetch posts after adding
		  queryClient.invalidateQueries(["getAllUsers"]);
	
		  // Option 2: Update cache manually for better performance
		  // queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost]);
		},
		onError: (error) => {
			console.log("mutation error", error.message)
		}
	  });

	  

	const onSubmit = async (data) => {
		mutation.mutate(data);
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
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
									{/* full_name Field */}
									<FormField
										control={form.control}
										name="name"
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

									{/* Submit Button */}
									<Button type="submit" className="w-full" disabled={false}>
										Register
									</Button>
								</form>
							</Form>

							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<Link to="/">
									<Button variant="link" size="none" asChild>
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
