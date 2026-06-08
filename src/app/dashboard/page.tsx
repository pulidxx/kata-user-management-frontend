"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { AppShell } from "@/shared/components/layout/app-shell";
import { useAuth } from "@/core/auth/AuthContext";
import { useClients } from "@/features/clients/hooks/use-clients";
import { ROLE_LABELS } from "@/shared/types/common.types";
import { StatusBadge } from "@/features/clients/components/status-badge";
import { Spinner } from "@/shared/components/feedback/spinner";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { clients, isLoading } = useClients();

  const recent = [...clients]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Bienvenido de nuevo,</p>
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rol:{" "}
          <span className="font-medium text-foreground">
            {user ? ROLE_LABELS[user.role] : ""}
          </span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-primary">
          <Spinner size={28} />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold">Clientes recientes</h3>
            <Link
              href="/clients"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver todos <FiArrowRight size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No existen clientes registrados.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/clients/${c.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {c.fullName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.email}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
