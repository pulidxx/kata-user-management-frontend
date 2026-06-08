export type ClientStatus =
  | "Contactado"
  | "En Validación"
  | "Activo"
  | "Inactivo"
  | "Rechazado";

export const CLIENT_STATUSES: ClientStatus[] = [
  "Contactado",
  "En Validación",
  "Activo",
  "Inactivo",
  "Rechazado",
];

export type DocumentType = "CC" | "CE" | "TI" | "PAS" | "NIT";

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "PAS", label: "Pasaporte" },
  { value: "NIT", label: "NIT" },
];

export interface Client {
  id: string;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  birthDate: string;
  status: ClientStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
