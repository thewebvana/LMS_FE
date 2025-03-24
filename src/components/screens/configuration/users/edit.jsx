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
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/shadcn/ui/form";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // If using React Router
import { editPrincipalValidation } from "@/components/utils/schemas/config";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Edit(props) {

	console.log(props)
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(editPrincipalValidation),
		defaultValues: {
			full_name: props.full_name || "",
			email: props.email || "",
			mobile: props.mobile || "",
			role: props.role || "",
			gender: props.gender || "",
			address: props.address || "",
			active: props.active || false,
		},
	});

	const mutation = useMutation({
		// mutationFn: registerUser,
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
			role: "PRINCIPAL",
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
		<div className="flex w-full items-center justify-center  ">
			<div className="w-full max-w-2xl">
				<div className="flex flex-col gap-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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

								{/* Role Field */}
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<FormControl>
												<Select {...field}>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Theme" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="light">Light</SelectItem>
														<SelectItem value="dark">Dark</SelectItem>
														<SelectItem value="system">System</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Gender Field */}
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
											<FormControl>
												<Select {...field} >
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Male" v />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="light">MALE</SelectItem>
														<SelectItem value="dark">FEMALE</SelectItem>
														<SelectItem value="system">OTHER</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Address Field */}
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
											<FormControl>
												<Input type="address" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-4">
									<FormField
										control={form.control}
										name="marketing_emails"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
												<div className="space-y-0.5">
													<FormLabel>User Status</FormLabel>
													<FormDescription>
														You can change status of user
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full"
								disabled={mutation.isPending}
							>
								Update
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
				</div>
			</div>
		</div>
	);
}
