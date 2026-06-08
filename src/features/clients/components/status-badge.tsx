import type { ClientStatus } from "@/features/clients/types/client.types";

const STYLES: Record<ClientStatus, string> = {
  Contactado:
    "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30",
  "En Validación":
    "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
  Activo:
    "bg-green-500/15 text-green-600 dark:text-green-300 border-green-500/30",
  Inactivo:
    "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/30",
  Rechazado: "bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30",
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
