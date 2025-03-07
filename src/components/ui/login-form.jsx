"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import useAxios from "@/axios/interceptors";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export function LoginForm({ className, ...props }) {
	
	const [Axios] = useAxios();

	useEffect(() => {
		console.log("hello");
		let fetchData = async () => {
			try {
				let response = await Axios.get(`${apiUrl}/posts`);
				console.log(response);
			} catch (error) {
				console.error("error", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="flex flex-col gap-6">
							<div className="grid gap-4">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="abc@example.com" />
							</div>
							<div className="grid gap-4">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
								</div>
								<Input id="password" type="password" />
							</div>
							<a
								href="#"
								className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</a>
							<Link to="/dashboard">
								<Button className="w-full">Login</Button>
							</Link>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link to="/signup">
								<Button variant="link" size="none">
									Register
								</Button>
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
