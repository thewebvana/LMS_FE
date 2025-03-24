import { z } from "zod";

export const editPrincipalValidation = z.object({
	full_name: z
		.string()
		.min(2, { message: "Username must be at least 2 characters." })
		.max(20, { message: "Username must be at most 20 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	mobile: z
		.string()
		.min(10, { message: "mobile must be at least 10 characters." })
		.max(12, { message: "mobile must be at most 12 characters." }),
	role: z.string(),
	gender: z.string(),
	address: z
		.string()
		.min(1, { message: "Username must be at least 2 characters." })
		.max(90, { message: "Username must be at most 20 characters." }),
	active: z.boolean(),
});
