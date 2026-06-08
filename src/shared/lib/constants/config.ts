export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  TIMEOUT: 30000,
} as const;
