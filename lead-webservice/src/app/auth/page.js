"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { PillInput } from "@/components/PillInput";
import { PillButton } from "@/components/PillButton";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { Loader } from "@/components/Loader";
import { TEST_EMAIL, TEST_PASSWORD } from "@/config/env";

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

  const handleQuickLogin = async () => {
    if (loading) return; 
    
    try {
      setEmail(TEST_EMAIL);
      setPassword(TEST_PASSWORD);
      await authenticateUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,   
      });
      router.push("/");
    } catch (error) {
      console.log("Quick login failed", error);
    }
  };

 
 
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      router.replace("/");
    }
  }, [isCheckingAuth, isAuthenticated]);

   
  if (isCheckingAuth || isAuthenticated) {
    return <Loader/>;
  }

 return (
    <main className="h-screen w-full bg-background flex flex-col lg:flex-row overflow-hidden">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface-pebble/30 h-[48vh] lg:h-screen pt-4 lg:pt-0 cursor-pointer"
        onDoubleClick={handleQuickLogin} 
        onTouchStart={(e) => {
          if (e.detail === 2) handleQuickLogin();
        }}
      >
        <div className="relative w-[92%] h-[90%] lg:h-[70vh] overflow-hidden rounded-[40px] shadow-2xl">
          <Image
            src="/auth.jpg" 
            alt="Auth background"
            fill
            className="object-cover object-top select-none"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-6 pt-4 pb-2 lg:py-0 bg-background h-[52vh] lg:h-screen">
        <div className="w-full max-w-[400px]">
          <div className="mb-4 lg:mb-10 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-1">
              LeadFloww
            </h1>

          </div>

          <form onSubmit={submit} className="space-y-3 lg:space-y-5">
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <PillButton
              type="submit"
              variant="solid"
              size="md"
              className="w-full h-12 lg:h-14 text-lg mt-1"
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