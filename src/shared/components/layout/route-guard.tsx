"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/AuthContext";
import type { Role } from "@/shared/types/common.types";
import { Spinner } from "../feedback/spinner";

export function RouteGuard({
  children,
  allow,
}: {
  children: ReactNode;

  allow?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allow && !allow.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, loading, allow, router]);

  if (loading || !user || (allow && !allow.includes(user.role))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-primary">
        <Spinner size={32} />
      </div>
    );
  }

  return <>{children}</>;
}
