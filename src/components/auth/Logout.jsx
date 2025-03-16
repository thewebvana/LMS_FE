import useAuthStore from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function Logout(props) {
	const { logoutUser } = useAuthStore();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(true); // Open by default

	// useEffect(() => {
	// 	toast.success("Logout successfully!");
	// 	logoutUser();
	// 	Cookies.remove("token");
	// 	setTimeout(() => {
	// 		navigate("/");
	// 	}, 100);
	// }, []);

	function handleCancel() {
		setIsOpen(false);
		navigate("/dashboard");
	}
	function handleLogout() {
		setIsOpen(false);
		toast.success("Logout successfully!");
		logoutUser();
		Cookies.remove("token");
		setTimeout(() => {
			navigate("/");
		}, 100);
	}
	return (
		<>
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure want to logout?</AlertDialogTitle>
						{/* <AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription> */}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => handleCancel()}>
							No
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleLogout()}>
							Yes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default Logout;
