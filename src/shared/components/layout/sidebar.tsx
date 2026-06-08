"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiUsers, FiLogOut, FiX, FiUserCheck } from "react-icons/fi";
import { useAuth } from "@/core/auth/AuthContext";
import { ROLE_LABELS } from "@/shared/types/common.types";
import { canManageUsers } from "@/core/permissions/rbac";
import { ConfirmDialog } from "../feedback/confirm-dialog";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: FiGrid },
    { href: "/clients", label: "Clientes", icon: FiUsers },
    ...(canManageUsers(user)
      ? [{ href: "/users", label: "Usuarios", icon: FiUserCheck }]
      : []),
  ];

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <img
              src="/logo-banco-bogota.svg"
              alt="Banco de Bogotá"
              className="h-9 w-9"
            />
            <span className="text-lg font-bold">Portal BdB</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="Cerrar menú"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mx-3 mb-4 flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-sidebar-accent-foreground">
              {user ? ROLE_LABELS[user.role] : ""}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <FiLogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="Cerrar sesión"
        message="¿Está seguro de que desea cerrar la sesión?"
        confirmLabel="Cerrar sesión"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          logout();
          router.replace("/login");
        }}
      />
    </>
  );
}
