import { API_CONFIG } from "../../../shared/lib/constants/config";
import { fetchWithAuth, handleResponse } from "../../../shared/lib/api/client";
import type { User } from "../types/auth.types";

export async function apiLogin(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>(response);

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data.user;
}

export async function apiRegister(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await handleResponse<{ user: User }>(response);
  return data.user;
}

export async function apiCurrentUser(): Promise<User | null> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const response = await fetchWithAuth("/auth/me");
    return await handleResponse<User>(response);
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
}

export async function apiLogout(): Promise<void> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
    try {
      const response = await fetchWithAuth("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      await handleResponse(response);
    } catch {}
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
