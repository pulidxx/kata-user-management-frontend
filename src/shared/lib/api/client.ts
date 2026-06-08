import { API_CONFIG } from "../constants/config";
import { ApiError } from "../../types/api.types";

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  if (response.status === 401 && accessToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] =
        `Bearer ${localStorage.getItem("accessToken")}`;
      return fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...(options.headers as Record<string, string>) },
      });
    }
  }

  return response;
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: { message: "Error del servidor", status: response.status },
    }));

    const errorObj = errorData.error || errorData;

    throw new ApiError(
      errorObj.message || errorObj.error || "Error en la petición",
      errorObj.status || errorData.statusCode || response.status,
      errorObj.code,
      errorData.details,
    );
  }

  return response.json();
}
