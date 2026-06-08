"use client";

import { FiSearch, FiX } from "react-icons/fi";
import {
  CLIENT_STATUSES,
  type ClientStatus,
} from "@/features/clients/types/client.types";

export interface Filters {
  search: string;
  name: string;
  document: string;
  email: string;
  city: string;
  status: ClientStatus | "";
  date: string;
}

export const EMPTY_FILTERS: Filters = {
  search: "",
  name: "",
  document: "",
  email: "",
  city: "",
  status: "",
  date: "",
};

export function ClientFilters({
  filters,
  onChange,
  onClear,
  cities,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
  cities: string[];
}) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });
  const hasFilters = Object.values(filters).some(Boolean);

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Búsqueda global: nombre, documento, correo o teléfono..."
          aria-label="Búsqueda global"
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Nombre
          </label>
          <input
            className={inputClass}
            value={filters.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Documento
          </label>
          <input
            className={inputClass}
            value={filters.document}
            onChange={(e) => set("document", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Correo
          </label>
          <input
            className={inputClass}
            value={filters.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Ciudad
          </label>
          <select
            className={inputClass}
            value={filters.city}
            onChange={(e) => set("city", e.target.value)}
          >
            <option value="">Todas</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Estado
          </label>
          <select
            className={inputClass}
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="">Todos</option>
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Fecha de creación
          </label>
          <input
            type="date"
            className={inputClass}
            value={filters.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <FiX size={16} /> Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
