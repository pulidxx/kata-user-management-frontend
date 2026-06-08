import type { Role } from "../../../shared/types/common.types";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
  assignedClientIds?: string[];
}
