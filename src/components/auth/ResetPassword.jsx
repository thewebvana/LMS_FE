"use client";
import { Button } from "@/components/shadcn/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn/ui/form";

const apiUrl = import.meta.env.VITE_API_URL;

// Zod validation schema
const resetSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // ✅ Correct usage


    const form = useForm({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or expired reset link.");
            // navigate("/");
        }
    }, [token, navigate]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            return axios.post(`${apiUrl}/auth/v1/reset-password`, { ...data, token });
        },
        onSuccess: () => {
            toast.success("Password reset successfully! Please log in.");
            navigate("/login");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        },
    });

    const handleResetPassword = async (data) => {
        const toastId = toast.loading("Resetting password...");
        try {
            await mutation.mutateAsync(data);
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Set New Password</CardTitle>
                        <CardDescription>Enter a new password below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleResetPassword)}>
                                <div className="flex flex-col gap-6">
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter new password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Confirm password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                        {mutation.isPending ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
