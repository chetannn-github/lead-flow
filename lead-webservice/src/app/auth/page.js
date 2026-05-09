"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PillInput } from "@/components/PillInput";
import { PillButton } from "@/components/PillButton";
import GoogleSvg from "./components/GoogleSvg";

import { useAuthStore } from "@/store/authStore";
import { Loader } from "@/components/Loader";

export default function AuthPage() {
  const router = useRouter();

  const {
    authenticateUser,
    signInWithGoogle,
    loading,
    isCheckingAuth,
    isAuthenticated,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    try {
      await authenticateUser({
        email,
        password,
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGoogleAuth() {
    try {
      const googleToken = "sample_google_token";
      await signInWithGoogle(googleToken);

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
 
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated]);

   
  if (isCheckingAuth || isAuthenticated) {
    return <Loader/>;
  }

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        <h1 className="text-center text-4xl font-bold tracking-tight">
          LeadFloww
        </h1>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          Continue with your account
        </p>

        <form onSubmit={submit} className="mt-10 space-y-4">
          <PillInput
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <PillInput
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <PillButton
            type="submit"
            variant="solid"
            size="md"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Continue"}
          </PillButton>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-hairline" />

          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            or
          </span>

          <div className="h-px flex-1 bg-hairline" />
        </div>

        <PillButton
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <GoogleSvg />
          Continue with Google
        </PillButton>
      </div>
    </main>
  );
}