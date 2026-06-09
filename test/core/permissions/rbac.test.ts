import { describe, expect, it } from "vitest";
import {
  canChangeStatus,
  canCreateClient,
  canDeleteClient,
  canEditClient,
  canManageUsers,
  canViewClient,
  visibleClients,
} from "@/core/permissions/rbac";
import type { User } from "@/features/auth/types/auth.types";
import type { Client } from "@/features/clients/types/client.types";

const admin: User = {
  id: "u-admin",
  name: "Admin",
  email: "admin@example.com",
  password: "secret",
  role: "admin",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const asesor: User = {
  id: "u-asesor",
  name: "Asesor",
  email: "asesor@example.com",
  password: "secret",
  role: "asesor",
  createdAt: "2026-01-01T00:00:00.000Z",
  assignedClientIds: ["c-3"],
};

const consulta: User = {
  id: "u-consulta",
  name: "Consulta",
  email: "consulta@example.com",
  password: "secret",
  role: "consulta",
  createdAt: "2026-01-01T00:00:00.000Z",
  assignedClientIds: ["c-2"],
};

const clientOwnedByAsesor: Client = {
  id: "c-1",
  fullName: "Cliente 1",
  documentType: "CC",
  documentNumber: "123",
  email: "client1@example.com",
  phone: "3000000000",
  city: "Bogotá",
  address: "Calle 1",
  birthDate: "1990-01-01",
  status: "Activo",
  ownerId: "u-asesor",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const otherClient: Client = {
  ...clientOwnedByAsesor,
  id: "c-2",
  fullName: "Cliente 2",
  ownerId: "u-other",
};

describe("rbac", () => {
  it("permite crear clientes según el rol", () => {
    expect(canCreateClient(admin)).toBe(true);
    expect(canCreateClient(asesor)).toBe(true);
    expect(canCreateClient(consulta)).toBe(false);
    expect(canCreateClient(null)).toBe(false);
  });

  it("limita edición y acciones al propietario o admin", () => {
    expect(canEditClient(admin, otherClient)).toBe(true);
    expect(canEditClient(asesor, clientOwnedByAsesor)).toBe(true);
    expect(canEditClient(asesor, otherClient)).toBe(false);
    expect(canDeleteClient(asesor, otherClient)).toBe(false);
    expect(canChangeStatus(asesor, clientOwnedByAsesor)).toBe(true);
  });

  it("define visibilidad por rol y asignación", () => {
    const clients = [clientOwnedByAsesor, otherClient, { ...otherClient, id: "c-3" }];

    expect(visibleClients(admin, clients)).toEqual(clients);
    expect(visibleClients(asesor, clients)).toEqual([clientOwnedByAsesor]);
    expect(visibleClients(consulta, clients)).toEqual([otherClient]);
    expect(visibleClients(null, clients)).toEqual([]);
    expect(canViewClient(consulta, otherClient)).toBe(true);
    expect(canViewClient(consulta, clientOwnedByAsesor)).toBe(false);
  });

  it("solo permite administrar usuarios a un admin", () => {
    expect(canManageUsers(admin)).toBe(true);
    expect(canManageUsers(asesor)).toBe(false);
    expect(canManageUsers(null)).toBe(false);
  });
});