import { z } from "zod";

export const principalSchema = z.object({
  username: z.string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(20, { message: "Username must be at most 20 characters." }),

  email: z.string()
    .email({ message: "Invalid email address." }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters." }),

  confirmPassword: z.string()
    .min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
