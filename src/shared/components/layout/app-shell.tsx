"use client";

import { useState, type ReactNode } from "react";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { Sidebar } from "./sidebar";
import { useTheme } from "@/shared/hooks/useTheme";
import { RouteGuard } from "./route-guard";
import type { Role } from "@/shared/types/common.types";

export function AppShell({
  children,
  title,
  allow,
}: {
  children: ReactNode;
  title: string;
  allow?: Role[];
}) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <RouteGuard allow={allow}>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg p-2 hover:bg-muted lg:hidden"
                aria-label="Abrir menú"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-border p-2 hover:bg-muted"
              aria-label={
                theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
              }
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}
