import useAuthStore from "@/store/useAuthStore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

function Logout() {
	const { logoutUser } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		toast.success("Logout successfully!");
		logoutUser();
		Cookies.remove("token");
		setTimeout(() => {
			navigate("/");
		}, 1000);
	}, []);

	return <></>;
}

export default Logout;
