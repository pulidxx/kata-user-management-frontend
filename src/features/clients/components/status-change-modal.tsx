"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import {
  CLIENT_STATUSES,
  type ClientStatus,
} from "@/features/clients/types/client.types";
import { Spinner } from "@/shared/components/feedback/spinner";

export function StatusChangeModal({
  open,
  current,
  clientName,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  current: ClientStatus;
  clientName: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (status: ClientStatus) => void;
}) {
  const [selected, setSelected] = useState<ClientStatus>(current);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="status-title" className="text-lg font-bold">
            Cambiar estado
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1 hover:bg-muted"
          >
            <FiX size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Cliente:{" "}
          <span className="font-medium text-foreground">{clientName}</span>
        </p>
        <label
          htmlFor="status-select"
          className="mb-1 block text-sm font-medium"
        >
          Nuevo estado
        </label>
        <select
          id="status-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value as ClientStatus)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          {CLIENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-secondary disabled:opacity-60"
          >
            {loading && <Spinner size={16} />}
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
