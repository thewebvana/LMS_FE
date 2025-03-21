import { z } from "zod";

export const principalSchema = z.object({
		full_name: z
			.string()
			.min(2, { message: "Username must be at least 2 characters." })
			.max(20, { message: "Username must be at most 20 characters." }),

		email: z.string().email({ message: "Invalid email address." }),

		mobile: z
			.string()
			.min(10, { message: "mobile must be at least 10 characters." })
			.max(12, { message: "mobile must be at most 12 characters." }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters." }),

		confirmPassword: z
			.string()
			.min(6, { message: "Password must be at least 6 characters." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),

	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters." }),
});

export const resetPassword = z.object({
	email: z.string().email({ message: "Invalid email address." })
});
