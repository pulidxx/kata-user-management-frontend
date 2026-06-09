"use client";

import useSWR from "swr";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "@/core/auth/AuthContext";
import { StatusBadge } from "./status-badge";
import { Spinner } from "@/shared/components/feedback/spinner";
import { apiGetClient } from "../services/clientService";
import { formatDate } from "../utils/export";
import { canViewClient } from "@/core/permissions/rbac";
import { DOCUMENT_TYPES, type Client } from "../types/client.types";

interface ClientDetailModalProps {
  clientId: string;
  onClose: () => void;
}

export function ClientDetailModal({
  clientId,
  onClose,
}: ClientDetailModalProps) {
  const { user } = useAuth();
  const {
    data: client,
    error,
    isLoading,
  } = useSWR<Client>(["client", clientId], () => apiGetClient(clientId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <h2 className="text-xl font-bold">Detalle del cliente</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-16 text-primary">
              <Spinner size={28} />
            </div>
          ) : error || !client || !canViewClient(user, client) ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <p className="font-medium">Cliente no encontrado o sin acceso</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {client.fullName}
                    </h3>
                  </div>
                  <StatusBadge status={client.status} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <InfoItem
                    icon={FiUser}
                    label="Documento"
                    value={`${
                      DOCUMENT_TYPES.find(
                        (d) => d.value === client.documentType,
                      )?.label ?? client.documentType
                    } ${client.documentNumber}`}
                  />
                  <InfoItem icon={FiMail} label="Email" value={client.email} />
                  <InfoItem
                    icon={FiPhone}
                    label="Teléfono"
                    value={client.phone}
                  />
                  <InfoItem
                    icon={FiMapPin}
                    label="Dirección"
                    value={client.address}
                  />
                  <InfoItem
                    icon={FiHome}
                    label="Ciudad"
                    value={client.city || "—"}
                  />
                  <InfoItem
                    icon={FiCalendar}
                    label="Fecha de nacimiento"
                    value={formatDate(client.birthDate)}
                  />
                </div>

                <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
                  <InfoItem
                    icon={FiCalendar}
                    label="Fecha de creación"
                    value={formatDate(client.createdAt)}
                  />
                  <InfoItem
                    icon={FiCalendar}
                    label="Última actualización"
                    value={formatDate(client.updatedAt)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-foreground">{value}</p>
      </div>
    </div>
  );
}
