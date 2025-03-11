("use client");
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
import useModalStore from "@/store/useModalStore";
import AddUser from "./AddUser";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
	const { openModal, content } = useModalStore();

	function handleClick() {
		openModal({
            Component: AddUser, // Pass the component
            title: "User Registration",
            description: "Fill out the form to create a new user account.",
        });
	}


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
							<form>
								<div className="flex flex-col gap-6">
									<div className="grid gap-4">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="abc@example.com"
										/>
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
								<div className="mt-4 text-center text-sm">
									<div variant="link" size="none" onClick={handleClick}>
										Register
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
