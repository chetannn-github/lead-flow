"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Dashboard from "./Dashboard";

export default function Page() {
  const router = useRouter();
  const {
    isCheckingAuth,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isCheckingAuth, isAuthenticated]);

  if (isCheckingAuth || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <Dashboard />;
}