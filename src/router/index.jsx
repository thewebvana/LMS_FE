import Layout from "@/layout";
import Dashboard from "@/pages/dashboard";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import Classrooms from "@/pages/settings/classrooms";
import Users from "@/pages/settings/users";
import { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Modal from "@/components/utils/Modal"
import { Toaster, toast } from 'sonner'
import useAuthStore from "@/store/useAuthStore";
import Logout from "@/components/auth/Logout";

const RedirectToLogin = () => {
	return (
		<>
			<Navigate to="/" />
		</>
	);
};

function AppRouter() {
	const {isAuthenticated } = useAuthStore();

	return (
		<Router>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/logout" element={<Logout />} />

					{/* Protected Routes */}
					{isAuthenticated ? (
						<Route element={<Layout />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/settings/users" element={<Users />} />
							<Route path="/settings/classrooms" element={<Classrooms />} />
						</Route>
					) : (
						<Route path="*" element={<Navigate to="/login" replace />} />
					)}
				</Routes>

				<Modal />
				<Toaster richColors />
				
			</ThemeProvider>
		</Router>
	);
}

export default AppRouter;
