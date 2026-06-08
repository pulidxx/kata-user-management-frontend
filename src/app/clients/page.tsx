"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiInbox,
} from "react-icons/fi";
import { AppShell } from "@/shared/components/layout/app-shell";
import { useAuth } from "@/core/auth/AuthContext";
import { useClients, useUsers } from "@/features/clients/hooks/use-clients";
import {
  ClientFilters,
  EMPTY_FILTERS,
  type Filters,
} from "@/features/clients/components/client-filters";
import { StatusBadge } from "@/features/clients/components/status-badge";
import { ConfirmDialog } from "@/shared/components/feedback/confirm-dialog";
import { StatusChangeModal } from "@/features/clients/components/status-change-modal";
import { ClientFormModal } from "@/features/clients/components/client-form-modal";
import { Spinner } from "@/shared/components/feedback/spinner";
import { useToast } from "@/shared/components/feedback/toast";
import {
  canCreateClient,
  canDeleteClient,
  canEditClient,
  canChangeStatus,
  canManageUsers,
} from "@/core/permissions/rbac";
import {
  apiCreateClient,
  apiDeleteClient,
  apiUpdateClient,
} from "@/features/clients/services/clientService";
import { ApiError } from "@/shared/types/api.types";
import {
  exportClientsToCSV,
  formatDate,
} from "@/features/clients/utils/export";
import type {
  Client,
  ClientStatus,
} from "@/features/clients/types/client.types";

type SortKey = "fullName" | "createdAt" | "status" | "city";
type SortDir = "asc" | "desc";

export default function ClientsPage() {
  return (
    <AppShell title="Clientes">
      <ClientsContent />
    </AppShell>
  );
}

function ClientsContent() {
  const { user } = useAuth();
  const { notify } = useToast();
  const { clients, isLoading, mutate } = useClients();
  const { users } = useUsers(canManageUsers(user));

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | undefined>();
  const [deleting, setDeleting] = useState<Client | undefined>();
  const [statusTarget, setStatusTarget] = useState<Client | undefined>();
  const [actionLoading, setActionLoading] = useState(false);

  const userMap = useMemo(
    () => new Map(users.map((u) => [u.id, u.name])),
    [users],
  );
  const cities = useMemo(
    () => [...new Set(clients.map((c) => c.city))].sort(),
    [clients],
  );
  const showAsesorColumn = canManageUsers(user);

  const filtered = useMemo(() => {
    const f = filters;
    const search = f.search.trim().toLowerCase();
    return clients.filter((c) => {
      if (search) {
        const hay =
          `${c.fullName} ${c.documentNumber} ${c.email} ${c.phone}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      if (f.name && !c.fullName.toLowerCase().includes(f.name.toLowerCase()))
        return false;
      if (f.document && !c.documentNumber.includes(f.document)) return false;
      if (f.email && !c.email.toLowerCase().includes(f.email.toLowerCase()))
        return false;
      if (f.city && c.city !== f.city) return false;
      if (f.status && c.status !== f.status) return false;
      if (f.date && c.createdAt.slice(0, 10) !== f.date) return false;
      return true;
    });
  }, [clients, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let res = 0;
      if (sortKey === "createdAt")
        res = +new Date(a.createdAt) - +new Date(b.createdAt);
      else res = String(a[sortKey]).localeCompare(String(b[sortKey]), "es");
      return sortDir === "asc" ? res : -res;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const handleCreate = async (
    values: Omit<Client, "id" | "ownerId" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await apiCreateClient(values);
      notify("Cliente creado exitosamente", "success");
      setFormOpen(false);
      setEditing(undefined);
      mutate();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al crear el cliente.",
        "error",
      );
    }
  };

  const handleUpdate = async (
    values: Omit<Client, "id" | "ownerId" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await apiUpdateClient(editing!.id, values);
      notify("Cliente actualizado", "success");
      setFormOpen(false);
      setEditing(undefined);
      mutate();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al actualizar.",
        "error",
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setActionLoading(true);
    try {
      await apiDeleteClient(deleting.id);
      notify("Cliente eliminado", "success");
      setDeleting(undefined);
      mutate();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al eliminar.",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const confirmStatus = async (status: ClientStatus) => {
    if (!statusTarget) return;
    setActionLoading(true);
    try {
      await apiUpdateClient(statusTarget.id, { status });
      notify("Estado actualizado", "success");
      setStatusTarget(undefined);
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

  const SortIcon = ({ active }: { active: boolean }) =>
    !active ? (
      <FiChevronDown size={13} className="opacity-30" />
    ) : sortDir === "asc" ? (
      <FiChevronUp size={13} />
    ) : (
      <FiChevronDown size={13} />
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Gestiona el listado de clientes según tus permisos.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={async () => {
              try {
                await exportClientsToCSV({
                  status: filters.status || undefined,
                  search: filters.search || undefined,
                });
                notify("Clientes exportados correctamente", "success");
              } catch {
                notify("Error al exportar clientes", "error");
              }
            }}
            disabled={clients.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            <FiDownload size={16} /> Exportar CSV
          </button>
          {canCreateClient(user) && (
            <button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-secondary"
            >
              <FiPlus size={16} /> Nuevo cliente
            </button>
          )}
        </div>
      </div>

      <ClientFilters
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onClear={clearFilters}
        cities={cities}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState hasFilters={Object.values(filters).some(Boolean)} />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <Th
                    onClick={() => toggleSort("fullName")}
                    active={sortKey === "fullName"}
                    icon={<SortIcon active={sortKey === "fullName"} />}
                  >
                    Nombre
                  </Th>
                  <th className="px-4 py-3 font-medium">Documento</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                  <th className="px-4 py-3 font-medium">Teléfono</th>
                  <Th
                    onClick={() => toggleSort("city")}
                    active={sortKey === "city"}
                    icon={<SortIcon active={sortKey === "city"} />}
                  >
                    Ciudad
                  </Th>
                  <Th
                    onClick={() => toggleSort("status")}
                    active={sortKey === "status"}
                    icon={<SortIcon active={sortKey === "status"} />}
                  >
                    Estado
                  </Th>
                  <Th
                    onClick={() => toggleSort("createdAt")}
                    active={sortKey === "createdAt"}
                    icon={<SortIcon active={sortKey === "createdAt"} />}
                  >
                    Creación
                  </Th>
                  {showAsesorColumn && (
                    <th className="px-4 py-3 font-medium">Asesor</th>
                  )}
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageItems.map((c) => (
                  <tr key={c.id} className="transition hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{c.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.documentNumber}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.phone}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.city}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </td>
                    {showAsesorColumn && (
                      <td className="px-4 py-3 text-muted-foreground">
                        {userMap.get(c.ownerId) ?? "—"}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <RowActions
                        client={c}
                        onView={() => {}}
                        onEdit={() => {
                          setEditing(c);
                          setFormOpen(true);
                        }}
                        onStatus={() => setStatusTarget(c)}
                        onDelete={() => setDeleting(c)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {pageItems.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{c.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.email}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <dt className="font-medium text-foreground">Documento</dt>
                    <dd>{c.documentNumber}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Teléfono</dt>
                    <dd>{c.phone}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Ciudad</dt>
                    <dd>{c.city}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Creación</dt>
                    <dd>{formatDate(c.createdAt)}</dd>
                  </div>
                  {showAsesorColumn && (
                    <div className="col-span-2">
                      <dt className="font-medium text-foreground">Asesor</dt>
                      <dd>{userMap.get(c.ownerId) ?? "—"}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-3 flex justify-end border-t border-border pt-3">
                  <RowActions
                    client={c}
                    onView={() => {}}
                    onEdit={() => {
                      setEditing(c);
                      setFormOpen(true);
                    }}
                    onStatus={() => setStatusTarget(c)}
                    onDelete={() => setDeleting(c)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                Mostrando {total === 0 ? 0 : start + 1} -{" "}
                {Math.min(start + pageSize, total)} de {total} registros
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                aria-label="Registros por página"
                className="rounded-lg border border-input bg-background px-2 py-1 text-sm outline-none focus:border-ring"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / página
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <PagerBtn
                onClick={() => setPage(1)}
                disabled={currentPage === 1}
                label="Primera"
              >
                <FiChevronsLeft size={16} />
              </PagerBtn>
              <PagerBtn
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                label="Anterior"
              >
                <FiChevronLeft size={16} />
              </PagerBtn>
              <span className="px-3 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <PagerBtn
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                label="Siguiente"
              >
                <FiChevronRight size={16} />
              </PagerBtn>
              <PagerBtn
                onClick={() => setPage(totalPages)}
                disabled={currentPage === totalPages}
                label="Última"
              >
                <FiChevronsRight size={16} />
              </PagerBtn>
            </div>
          </div>
        </>
      )}

      <ClientFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(undefined);
        }}
        onSubmit={editing ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar cliente"
        message={
          <>
            ¿Está seguro de eliminar a <strong>{deleting?.fullName}</strong>?
            Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        loading={actionLoading}
        onCancel={() => setDeleting(undefined)}
        onConfirm={confirmDelete}
      />

      {statusTarget && (
        <StatusChangeModal
          open={!!statusTarget}
          current={statusTarget.status}
          clientName={statusTarget.fullName}
          loading={actionLoading}
          onClose={() => setStatusTarget(undefined)}
          onConfirm={confirmStatus}
        />
      )}
    </div>
  );

  function RowActions({
    client,
    onEdit,
    onStatus,
    onDelete,
  }: {
    client: Client;
    onView: () => void;
    onEdit: () => void;
    onStatus: () => void;
    onDelete: () => void;
  }) {
    return (
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/clients/${client.id}`}
          aria-label="Ver detalle"
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <FiEye size={16} />
        </Link>
        {canChangeStatus(user, client) && (
          <button
            onClick={onStatus}
            aria-label="Cambiar estado"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <FiRefreshCw size={16} />
          </button>
        )}
        {canEditClient(user, client) && (
          <button
            onClick={onEdit}
            aria-label="Editar"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <FiEdit2 size={16} />
          </button>
        )}
        {canDeleteClient(user, client) && (
          <button
            onClick={onDelete}
            aria-label="Eliminar"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    );
  }
}

function Th({
  children,
  onClick,
  active,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 font-medium">
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 transition hover:text-foreground ${active ? "text-foreground" : ""}`}
      >
        {children} {icon}
      </button>
    </th>
  );
}

function PagerBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-lg border border-border p-2 transition hover:bg-muted disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
      <FiInbox size={40} className="text-muted-foreground" />
      <p className="mt-4 font-medium">
        {hasFilters
          ? "No se encontraron resultados"
          : "No existen clientes registrados"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasFilters
          ? "Intenta ajustar o limpiar los filtros."
          : "Crea tu primer cliente para comenzar."}
      </p>
    </div>
  );
}
