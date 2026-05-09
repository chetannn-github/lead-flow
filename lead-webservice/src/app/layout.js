"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import "./globals.css";

export default function RootLayout({ children }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}