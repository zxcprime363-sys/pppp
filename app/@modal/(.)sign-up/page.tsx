"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/hooks/user/session";

const signUpSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export interface SignUpResponse {
  success: boolean;
  error?: string;
}
export default function SignUpModal() {
  const [open, setOpen] = useState(true);
  const { isLoggedIn } = useSession();
  const router = useRouter();
  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => {
        router.back();
      }, 300);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setOpen(false);
      router.push("/");
    }
  }, [isLoggedIn]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const { data } = await axios.post<SignUpResponse>("/api/sign-up", values);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Account created successfully", {
          description: "Redirecting to login page...",
        });

        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      } else {
        toast.error(data.error || "Sign up failed");
      }
    },
    onError: (error: any) => {
      form.setError("root", {
        message: error.response?.data?.error || "Something went wrong",
      });
    },
  });

  function onSubmit(values: SignUpFormValues) {
    mutation.mutate(values);
  }

  return (
    <Drawer open={open} onOpenChange={(value) => handleCloseDrawer(value)}>
      <DrawerContent className=" outline-none max-w-4xl h-screen mx-auto">
        <DrawerHeader className="sr-only">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center items-center py-8  h-full">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
          >
            <FieldSet>
              <FieldTitle className="text-2xl text-center">Sign Up</FieldTitle>

              <FieldGroup>
                {/* Full Name */}
                <Field>
                  <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="full_name"
                      disabled={mutation.isPending}
                      placeholder="John Doe"
                      {...form.register("full_name")}
                    />
                  </FieldContent>
                  <FieldError>
                    {form.formState.errors.full_name?.message}
                  </FieldError>
                </Field>

                {/* Username */}
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <FieldContent>
                    <Input
                      id="username"
                      disabled={mutation.isPending}
                      placeholder="johndoe"
                      {...form.register("username")}
                    />
                  </FieldContent>
                  <FieldError>
                    {form.formState.errors.username?.message}
                  </FieldError>
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      disabled={mutation.isPending}
                      placeholder="your@email.com"
                      {...form.register("email")}
                    />
                  </FieldContent>
                  <FieldError>
                    {form.formState.errors.email?.message}
                  </FieldError>
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <FieldContent>
                    <Input
                      id="password"
                      type="password"
                      disabled={mutation.isPending}
                      placeholder="Password"
                      {...form.register("password")}
                    />
                  </FieldContent>
                  <FieldDescription>
                    Must be at least 6 characters.
                  </FieldDescription>
                  <FieldError>
                    {form.formState.errors.password?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <>
                  Creating Account...
                  <Tailspin size="15" stroke="3" speed="1" color="black" />
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Root API Error */}
            {form.formState.errors.root && (
              <p className="text-sm text-center text-red-500 font-medium p-3 bg-red-500/10 rounded-md">
                {form.formState.errors.root.message}
              </p>
            )}

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href={"/sign-in"}>
                <strong className="text-foreground underline">Sign In</strong>
              </Link>{" "}
            </p>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
