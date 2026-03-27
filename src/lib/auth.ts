import { apiClient } from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiClient<User>("/auth/me");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function removeTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
