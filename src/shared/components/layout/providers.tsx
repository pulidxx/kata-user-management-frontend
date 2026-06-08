"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/core/auth/AuthContext";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { ToastProvider } from "@/shared/components/feedback/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
