"use client";

import { useState } from "react";
import { FiX, FiAlertTriangle, FiUser } from "react-icons/fi";
import { ROLE_LABELS } from "@/shared/types/common.types";
import type { User } from "@/features/users/types/user.types";
import { Spinner } from "@/shared/components/feedback/spinner";

export function ReassignClientsModal({
  user,
  clientCount,
  availableUsers,
  onClose,
  onConfirm,
}: {
  user: User;
  clientCount: number;
  availableUsers: User[];
  onClose: () => void;
  onConfirm: (newOwnerId: string | null) => Promise<void>;
}) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [deleteClients, setDeleteClients] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(deleteClients ? null : selectedUserId || null);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = deleteClients || selectedUserId !== "";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-500/15 p-2 text-amber-600 dark:text-amber-400">
              <FiAlertTriangle size={20} />
            </div>
            <h2 className="text-lg font-bold">Reasignar clientes</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1 hover:bg-muted"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              {user.name} tiene {clientCount} cliente
              {clientCount !== 1 ? "s" : ""} asignado
              {clientCount !== 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">
              Debes reasignarlos a otro usuario o eliminarlos antes de
              continuar.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Selecciona una opción:
            </label>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/50">
                <input
                  type="radio"
                  name="action"
                  checked={!deleteClients}
                  onChange={() => setDeleteClients(false)}
                  className="mt-1 h-4 w-4 cursor-pointer accent-primary"
                />
                <div className="flex-1">
                  <p className="font-medium">Reasignar a otro usuario</p>
                  <p className="text-xs text-muted-foreground">
                    Los clientes serán transferidos a otro usuario
                  </p>
                  {!deleteClients && (
                    <div className="mt-3">
                      <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">-- Selecciona un usuario --</option>
                        {availableUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({ROLE_LABELS[u.role]}) - {u.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/50">
                <input
                  type="radio"
                  name="action"
                  checked={deleteClients}
                  onChange={() => setDeleteClients(true)}
                  className="mt-1 h-4 w-4 cursor-pointer accent-destructive"
                />
                <div className="flex-1">
                  <p className="font-medium text-destructive">
                    Eliminar todos los clientes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Los {clientCount} cliente{clientCount !== 1 ? "s" : ""}{" "}
                    serán eliminado{clientCount !== 1 ? "s" : ""}{" "}
                    permanentemente
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canProceed || loading}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                deleteClients
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size={16} />
                  Procesando...
                </div>
              ) : deleteClients ? (
                "Eliminar todo"
              ) : (
                "Reasignar y continuar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
