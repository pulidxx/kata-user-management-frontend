"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiHome,
} from "react-icons/fi";
import { AppShell } from "@/shared/components/layout/app-shell";
import { useAuth } from "@/core/auth/AuthContext";
import { StatusBadge } from "@/features/clients/components/status-badge";
import { ConfirmDialog } from "@/shared/components/feedback/confirm-dialog";
import { StatusChangeModal } from "@/features/clients/components/status-change-modal";
import { ClientFormModal } from "@/features/clients/components/client-form-modal";
import { Spinner } from "@/shared/components/feedback/spinner";
import { useToast } from "@/shared/components/feedback/toast";
import {
  apiGetClient,
  apiDeleteClient,
  apiUpdateClient,
} from "@/features/clients/services/clientService";
import { ApiError } from "@/shared/types/api.types";
import { formatDate } from "@/features/clients/utils/export";
import {
  canEditClient,
  canDeleteClient,
  canChangeStatus,
  canViewClient,
} from "@/core/permissions/rbac";
import {
  DOCUMENT_TYPES,
  type Client,
  type ClientStatus,
} from "@/features/clients/types/client.types";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell title="Detalle del cliente">
      <DetailContent id={id} />
    </AppShell>
  );
}

function DetailContent({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const {
    data: client,
    error,
    isLoading,
    mutate,
  } = useSWR<Client>(["client", id], () => apiGetClient(id));

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-primary">
        <Spinner size={28} />
      </div>
    );
  }

  if (error || !client || !canViewClient(user, client)) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <p className="font-medium">Cliente no encontrado o sin acceso</p>
        <Link
          href="/clients"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  const docLabel =
    DOCUMENT_TYPES.find((d) => d.value === client.documentType)?.label ??
    client.documentType;

  const handleUpdate = async (
    values: Omit<Client, "id" | "ownerId" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await apiUpdateClient(client.id, values);
      notify("Cliente actualizado", "success");
      setEditOpen(false);
      mutate();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al actualizar.",
        "error",
      );
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await apiDeleteClient(client.id);
      notify("Cliente eliminado", "success");
      router.replace("/clients");
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al eliminar.",
        "error",
      );
      setActionLoading(false);
    }
  };

  const confirmStatus = async (status: ClientStatus) => {
    setActionLoading(true);
    try {
      await apiUpdateClient(client.id, { status });
      notify("Estado actualizado", "success");
      setStatusOpen(false);
      mutate();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al cambiar el estado.",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const personal = [
    { icon: FiUser, label: "Nombre completo", value: client.fullName },
    {
      icon: FiCreditCard,
      label: "Documento",
      value: `${docLabel} — ${client.documentNumber}`,
    },
    { icon: FiMail, label: "Correo", value: client.email },
    { icon: FiPhone, label: "Teléfono", value: client.phone },
    { icon: FiHome, label: "Dirección", value: client.address },
    { icon: FiMapPin, label: "Ciudad", value: client.city },
    {
      icon: FiCalendar,
      label: "Fecha de nacimiento",
      value: formatDate(client.birthDate),
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <FiArrowLeft /> Volver al listado
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {client.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{client.fullName}</h2>
            <div className="mt-1">
              <StatusBadge status={client.status} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canChangeStatus(user, client) && (
            <button
              onClick={() => setStatusOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <FiRefreshCw size={16} /> Cambiar estado
            </button>
          )}
          {canEditClient(user, client) && (
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-secondary"
            >
              <FiEdit2 size={16} /> Editar
            </button>
          )}
          {canDeleteClient(user, client) && (
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              <FiTrash2 size={16} /> Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 font-semibold">Información personal</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            {personal.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <item.icon size={16} />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="break-words text-sm font-medium">
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Información adicional</h3>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Estado</dt>
              <dd className="mt-1">
                <StatusBadge status={client.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Fecha de creación
              </dt>
              <dd className="font-medium">{formatDate(client.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Última actualización
              </dt>
              <dd className="font-medium">{formatDate(client.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <ClientFormModal
        open={editOpen}
        initial={client}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Eliminar cliente"
        message={
          <>
            ¿Está seguro de eliminar a <strong>{client.fullName}</strong>?
          </>
        }
        confirmLabel="Eliminar"
        loading={actionLoading}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      {statusOpen && (
        <StatusChangeModal
          open={statusOpen}
          current={client.status}
          clientName={client.fullName}
          loading={actionLoading}
          onClose={() => setStatusOpen(false)}
          onConfirm={confirmStatus}
        />
      )}
    </div>
  );
}
