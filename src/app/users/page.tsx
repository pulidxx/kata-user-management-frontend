"use client";

import { useMemo, useState } from "react";
import { FiTrash2, FiX, FiInbox, FiPlus, FiEdit } from "react-icons/fi";
import { AppShell } from "@/shared/components/layout/app-shell";
import { useAuth } from "@/core/auth/AuthContext";
import { useClients, useUsers } from "@/features/clients/hooks/use-clients";
import { ConfirmDialog } from "@/shared/components/feedback/confirm-dialog";
import { ReassignClientsModal } from "@/features/users/components/reassign-clients-modal";
import { Spinner } from "@/shared/components/feedback/spinner";
import { useToast } from "@/shared/components/feedback/toast";
import { UserFormModal } from "@/features/users/components/user-form-modal";
import {
  apiDeleteUser,
  apiCreateUser,
  apiUpdateUser,
} from "@/features/users/services/userService";
import { ApiError } from "@/shared/types/api.types";
import { formatDate } from "@/features/clients/utils/export";
import { ROLE_LABELS, type Role } from "@/shared/types/common.types";
import type { User } from "@/features/users/types/user.types";

export default function UsersPage() {
  return (
    <AppShell title="Gestión de usuarios" allow={["admin"]}>
      <UsersContent />
    </AppShell>
  );
}

const ROLE_BADGE: Record<Role, string> = {
  admin: "bg-primary/15 text-primary border-primary/30",
  asesor: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30",
  consulta:
    "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/30",
};

function UsersContent() {
  const { user: current } = useAuth();
  const { notify } = useToast();
  const { users, isLoading, mutate } = useUsers(true);
  const { allClients } = useClients();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [formUser, setFormUser] = useState<User | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<User | undefined>();
  const [reassigning, setReassigning] = useState<User | undefined>();
  const [actionLoading, setActionLoading] = useState(false);

  const clientCount = useMemo(() => {
    const map = new Map<string, number>();
    allClients.forEach((c) =>
      map.set(c.ownerId, (map.get(c.ownerId) ?? 0) + 1),
    );
    return map;
  }, [allClients]);

  const filtered = users.filter((u) => {
    if (name && !u.name.toLowerCase().includes(name.toLowerCase()))
      return false;
    if (email && !u.email.toLowerCase().includes(email.toLowerCase()))
      return false;
    if (roleFilter && u.role !== roleFilter) return false;
    return true;
  });

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    password?: string;
    role: Role;
  }) => {
    try {
      await apiCreateUser({
        name: data.name,
        email: data.email,
        password: data.password!,
        role: data.role,
      });
      notify("Usuario creado exitosamente", "success");
      mutate();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateUser = async (data: {
    name: string;
    email: string;
    password?: string;
    role: Role;
  }) => {
    if (!formUser || formUser === null) return;
    try {
      await apiUpdateUser(formUser.id, data);
      notify("Usuario actualizado exitosamente", "success");
      mutate();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteClick = (user: User) => {
    const count = clientCount.get(user.id) ?? 0;
    if (count > 0) {
      setReassigning(user);
    } else {
      setDeleting(user);
    }
  };

  const handleReassign = async (newOwnerId: string | null) => {
    if (!reassigning) return;
    try {
      await apiDeleteUser(reassigning.id, { reassignTo: newOwnerId });
      notify(
        newOwnerId
          ? "Usuario eliminado y clientes reasignados"
          : "Usuario y sus clientes eliminados",
        "success",
      );
      setReassigning(undefined);
      mutate();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Error al eliminar.",
        "error",
      );
      throw err;
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setActionLoading(true);
    try {
      await apiDeleteUser(deleting.id);
      notify("Usuario eliminado", "success");
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

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";
  const hasFilters = !!(name || email || roleFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Administra los usuarios del sistema y sus roles.
        </p>
        <button
          onClick={() => setFormUser(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <FiPlus size={16} />
          Crear usuario
        </button>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Nombre
          </label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Correo
          </label>
          <input
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Rol
          </label>
          <select
            className={inputClass}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "")}
          >
            <option value="">Todos</option>
            {(["admin", "asesor", "consulta"] as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        {hasFilters && (
          <div className="sm:col-span-3 flex justify-end">
            <button
              onClick={() => {
                setName("");
                setEmail("");
                setRoleFilter("");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <FiX size={16} /> Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-primary">
          <Spinner size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <FiInbox size={40} className="text-muted-foreground" />
          <p className="mt-4 font-medium">No se encontraron usuarios</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Creación</th>
                  <th className="px-4 py-3 font-medium">Clientes</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="transition hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[u.role]}`}
                      >
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {clientCount.get(u.id) ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setFormUser(u)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-muted"
                        >
                          <FiEdit size={14} />
                          Editar
                        </button>
                        {u.id !== current?.id && (
                          <button
                            onClick={() => handleDeleteClick(u)}
                            aria-label="Eliminar usuario"
                            className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[u.role]}`}
                  >
                    {ROLE_LABELS[u.role]}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Clientes: {clientCount.get(u.id) ?? 0}</span>
                  <span>{formatDate(u.createdAt)}</span>
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
                  <button
                    onClick={() => setFormUser(u)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-muted"
                  >
                    <FiEdit size={14} />
                    Editar
                  </button>
                  {u.id !== current?.id && (
                    <button
                      onClick={() => handleDeleteClick(u)}
                      aria-label="Eliminar usuario"
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {formUser !== undefined && (
        <UserFormModal
          user={formUser === null ? undefined : formUser}
          onClose={() => setFormUser(undefined)}
          onSubmit={formUser === null ? handleCreateUser : handleUpdateUser}
        />
      )}

      {reassigning && (
        <ReassignClientsModal
          user={reassigning}
          clientCount={clientCount.get(reassigning.id) ?? 0}
          availableUsers={users.filter(
            (u) =>
              u.id !== reassigning.id &&
              (u.role === "admin" || u.role === "asesor"),
          )}
          onClose={() => setReassigning(undefined)}
          onConfirm={handleReassign}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar usuario"
        message={
          <>
            ¿Está seguro de eliminar a <strong>{deleting?.name}</strong>?
          </>
        }
        confirmLabel="Eliminar"
        loading={actionLoading}
        onCancel={() => setDeleting(undefined)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
