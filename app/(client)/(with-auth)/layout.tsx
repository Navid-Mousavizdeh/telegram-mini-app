"use client";

import { useAuth } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WithAuthProtected({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  return children;
}
