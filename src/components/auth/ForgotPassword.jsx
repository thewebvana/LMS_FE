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
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPassword } from "../utils/schemas/Auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn/ui/form";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(resetPassword),
        defaultValues: {
            email: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${apiUrl}/auth/v1/forgot-password`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Reset link sent to your email!");
            form.reset();
            navigate("/login");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        },
    });

    const handleResetPassword = async (data) => {
        const toastId = toast.loading("Sending reset link...");
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
                        <CardTitle className="text-xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email below to receive a reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleResetPassword)}>
                                <div className="flex flex-col gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="abc@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? "Sending..." : "Reset Password"}
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
