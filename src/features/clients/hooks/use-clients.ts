"use client";

import useSWR from "swr";
import { apiGetClients } from "@/features/clients/services/clientService";
import { apiGetUsers } from "@/features/users/services/userService";
import { useAuth } from "@/core/auth/AuthContext";
import { visibleClients } from "@/core/permissions/rbac";
import type { Client } from "@/features/clients/types/client.types";

export function useClients() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    user ? ["clients", user.id] : null,
    () => apiGetClients({ limit: 50 }),
  );
  const allClientsArray = data?.clients ?? [];
  const scoped = allClientsArray ? visibleClients(user, allClientsArray) : [];
  return {
    clients: scoped,
    allClients: allClientsArray,
    error,
    isLoading,
    mutate,
  };
}

export function useUsers(enabled: boolean) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? "users" : null,
    () => apiGetUsers(),
  );
  return { users: data ?? [], error, isLoading, mutate };
}
