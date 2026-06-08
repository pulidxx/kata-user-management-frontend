import { apiExportClients } from "../services/clientService";
import type { ClientStatus } from "../types/client.types";

export async function exportClientsToCSV(params?: {
  status?: ClientStatus;
  search?: string;
}): Promise<void> {
  try {
    const blob = await apiExportClients(params);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al exportar clientes:", error);
    throw error;
  }
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
