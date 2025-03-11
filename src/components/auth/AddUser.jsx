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
import { principalSchema } from "./validations";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import useAxios from "@/axios/interceptors";
import { useEffect } from "react";
import useModalStore from "@/store/useModalStore";

const apiUrl = import.meta.env.VITE_API_URL;

function AddUser() {


    const x = "soruabh"
	return (
		<>
				<div className="">
					Hello this is modal testing {x}
				</div>
		</>
	);
}

export default AddUser;
