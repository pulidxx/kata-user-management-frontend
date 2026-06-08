import { fetchWithAuth, handleResponse } from "../../../shared/lib/api/client";
import type { Role } from "../../../shared/types/common.types";
import type { User } from "../types/user.types";

export async function apiGetUsers(): Promise<User[]> {
  const response = await fetchWithAuth("/users");
  const data = await handleResponse<{ users: User[] }>(response);
  return data.users;
}

export async function apiCreateUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<User> {
  const response = await fetchWithAuth("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await handleResponse(response);
}

export async function apiUpdateUser(
  id: string,
  input: {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
  },
): Promise<User> {
  const response = await fetchWithAuth(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return await handleResponse(response);
}

export async function apiUpdateUserRole(id: string, role: Role): Promise<User> {
  const response = await fetchWithAuth(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  return await handleResponse(response);
}

export async function apiDeleteUser(
  id: string,
  options?: { reassignTo?: string | null },
): Promise<void> {
  const searchParams = new URLSearchParams();

  if (options?.reassignTo) {
    searchParams.set("reassignTo", options.reassignTo);
  } else if (options?.reassignTo === null) {
    searchParams.set("deleteClients", "true");
  }

  const query = searchParams.toString();
  const endpoint = `/users/${id}${query ? `?${query}` : ""}`;

  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
  });
  await handleResponse(response);
}
