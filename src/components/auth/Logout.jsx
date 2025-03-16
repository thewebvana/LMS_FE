import useAuthStore from "@/store/useAuthStore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Logout() {
	const { logoutUser } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		toast.success("Logout successfully!");
		logoutUser();
		setTimeout(() => {
			navigate("/");
		}, 1000);
	}, []);

	return <></>;
}

export default Logout;
