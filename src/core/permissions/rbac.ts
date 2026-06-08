import type { User } from "@/features/auth/types/auth.types";
import type { Client } from "@/features/clients/types/client.types";

export function canCreateClient(user: User | null) {
  return user?.role === "admin" || user?.role === "asesor";
}

export function canEditClient(user: User | null, client: Client) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "asesor") return client.ownerId === user.id;
  return false;
}

export function canDeleteClient(user: User | null, client: Client) {
  return canEditClient(user, client);
}

export function canChangeStatus(user: User | null, client: Client) {
  return canEditClient(user, client);
}

export function canManageUsers(user: User | null) {
  return user?.role === "admin";
}

export function visibleClients(user: User | null, clients: Client[]) {
  if (!user) return [];
  if (user.role === "admin") return clients;
  if (user.role === "asesor")
    return clients.filter((c) => c.ownerId === user.id);

  const assigned = new Set(user.assignedClientIds ?? []);
  return clients.filter((c) => assigned.has(c.id));
}

export function canViewClient(user: User | null, client: Client) {
  return visibleClients(user, [client]).length > 0;
}
