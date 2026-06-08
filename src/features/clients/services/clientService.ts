import { API_CONFIG } from "../../../shared/lib/constants/config";
import { fetchWithAuth, handleResponse } from "../../../shared/lib/api/client";
import { ApiError } from "../../../shared/types/api.types";
import type { Client, ClientStatus } from "../types/client.types";

export async function apiGetClients(params?: {
  page?: number;
  limit?: number;
  status?: ClientStatus;
  search?: string;
}): Promise<{
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const endpoint = `/clients${query ? `?${query}` : ""}`;

  const response = await fetchWithAuth(endpoint);
  return await handleResponse(response);
}

export async function apiGetClient(id: string): Promise<Client> {
  const response = await fetchWithAuth(`/clients/${id}`);
  return await handleResponse(response);
}

export async function apiCreateClient(
  data: Omit<Client, "id" | "createdAt" | "updatedAt" | "ownerId">,
): Promise<Client> {
  const response = await fetchWithAuth("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await handleResponse(response);
}

export async function apiUpdateClient(
  id: string,
  data: Partial<Omit<Client, "id" | "createdAt" | "updatedAt" | "ownerId">>,
): Promise<Client> {
  const response = await fetchWithAuth(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return await handleResponse(response);
}

export async function apiUpdateClientStatus(
  id: string,
  status: ClientStatus,
): Promise<Client> {
  const response = await fetchWithAuth(`/clients/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return await handleResponse(response);
}

export async function apiDeleteClient(id: string): Promise<void> {
  const response = await fetchWithAuth(`/clients/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

export async function apiExportClients(params?: {
  status?: ClientStatus;
  search?: string;
}): Promise<Blob> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const endpoint = `/clients/export${query ? `?${query}` : ""}`;

  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  if (!response.ok) {
    throw new ApiError("Error al exportar clientes", response.status);
  }

  return response.blob();
}
