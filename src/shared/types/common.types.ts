export type Role = "admin" | "asesor" | "consulta";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  asesor: "Asesor",
  consulta: "Consulta",
};
