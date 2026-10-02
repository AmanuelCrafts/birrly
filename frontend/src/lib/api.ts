const API_BASE = "/api";

export interface ApiUser {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = (await response.json()) as ApiResponse<T>;
  return data;
}

export async function telegramAuth(initData: string): Promise<ApiResponse<{ user: ApiUser }>> {
  return apiFetch<{ user: ApiUser }>("/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData }),
  });
}

export async function getCurrentUser(): Promise<ApiResponse<{ user: ApiUser }>> {
  return apiFetch<{ user: ApiUser }>("/auth/me");
}

export async function logout(): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
