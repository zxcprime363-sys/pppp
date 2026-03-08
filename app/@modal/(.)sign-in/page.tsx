"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { createClient } from "@/lib/supabase/client";
import { usePrimaryColorStore } from "@/store/dynamic-color";
import { Separator } from "@/components/ui/separator";
import GoogleIcon from "@/components/ui/icon/google-icon";
import FacebookIcon from "@/components/ui/icon/facebook-icon";
import logo from "@/assets/1.svg";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(2, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInResponse {
  success: boolean;
  error?: string;
}

export default function SignInModal() {
  const [open, setOpen] = useState(true);
  const { isLoggedIn } = useSession();
  const router = useRouter();
  const isMobile = useIsMobile();
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

  const queryClient = useQueryClient();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SignInFormValues) => {
      const { data } = await axios.post<SignInResponse>("/api/sign-in", values);
      return data;
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Account logged in successfully", {
          description: "Redirecting to home page...",
        });
        await queryClient.invalidateQueries({ queryKey: ["session"] });

        router.push("/");
      } else {
        form.setError("root", {
          message: data.error || "Login failed",
        });
      }
    },
    onError: (error: any) => {
      form.setError("root", {
        message: error.response?.data?.error || "Something went wrong",
      });
    },
  });

  function onSubmit(values: SignInFormValues) {
    mutation.mutate(values);
  }
  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }
  const primaryColor = usePrimaryColorStore((state) => state.primaryColor);
  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={(value) => handleCloseDrawer(value)}
    >
      <DrawerContent className="bg-background/80 backdrop-blur-2xl outline-none max-w-4xl h-screen mx-auto border-none">
        <DrawerHeader className="sr-only">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div
          className="grid place-items-center overflow-auto lg:py-8 pt-8 px-4 space-y-6  h-full"
          style={{ background: `rgba(${primaryColor},0.3)` }}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
          >
            <FieldSet>
              <FieldTitle className="text-2xl text-center">
                <img className="size-10" src={logo.src} alt="" />
                Welcome to Nextrax
              </FieldTitle>
              <FieldDescription>
                Enter your credentials to continue
              </FieldDescription>{" "}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      disabled={mutation.isPending}
                      placeholder="your@email.com"
                      {...form.register("email")}
                      aria-invalid={!!form.formState.errors.email}
                    />
                  </FieldContent>
                  <FieldDescription>
                    Enter your registered email address.
                  </FieldDescription>
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
                      aria-invalid={!!form.formState.errors.password}
                    />
                  </FieldContent>
                  <FieldDescription>
                    Enter your 8-digit password.
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
                  Signing In...
                  <Tailspin size="15" stroke="3" speed="1" color="black" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight />
                </>
              )}
            </Button>
            <div className="flex items-center gap-6">
              <Separator className="flex-1" />
              <p className="text-sm font-medium">or</p>{" "}
              <Separator className="flex-1" />
            </div>
            <Button
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
            >
              <FacebookIcon />
              Continue with Facebook
            </Button>
            {/* Root Error (API error) */}
            {form.formState.errors.root && (
              <p className="text-sm text-center text-red-500 font-medium  p-3 bg-red-500/10 rounded-md">
                {form.formState.errors.root.message}
              </p>
            )}
            <span className="text-sm text-muted-foreground  text-center leading-relaxed">
              <p> Don't have an account?</p>
              <p className="text-foreground underline">
                {" "}
                <Link href={"/sign-up"} className="font-bold">
                  Sign Up{" "}
                </Link>
              </p>
            </span>
          </form>
          <span className="lg:absolute lg:bottom-0 lg:inset-x-0 lg:p-4 p-2 leading-relaxed text-center text-xs text-muted-foreground">
            This site is protected by reCAPTCHA and the Google{" "}
            <span className="underline">Privacy Policy</span>{" "}
            <br className="hidden lg:block" />
            and <span className="underline">Terms of Service</span> apply.
          </span>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
