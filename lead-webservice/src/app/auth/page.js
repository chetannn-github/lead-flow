"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { PillInput } from "@/components/PillInput";
import { PillButton } from "@/components/PillButton";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { Loader } from "@/components/Loader";

export default function AuthPage() {
  const router = useRouter();

  const {
    authenticateUser,
    loading,
    isCheckingAuth,
    isAuthenticated,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    try {
      await authenticateUser({ email, password });
      router.push("/");
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
    <main className="min-h-screen w-full bg-background flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface-pebble/30 lg:h-screen pt-4">
        <div className="relative w-[90%] h-[500px] lg:h-[70vh] overflow-hidden rounded-[40px] shadow-2xl">
          <Image
            src="/auth.jpg" 
            alt="Auth background"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-2 py-12 lg:py-0 bg-background">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h1 className="text-center text-4xl font-bold tracking-tight mb-2">LeadFloww</h1>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <PillInput
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative w-full">
              <PillInput
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <PillButton
              type="submit"
              variant="solid"
              size="md"
              className="w-full h-14 text-lg"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
            </PillButton>
          </form>
        </div>
      </div>
    </main>
  );
}