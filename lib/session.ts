export const AUTH_TOKEN_KEY = "wecure-access-token";
export const AUTH_REFRESH_KEY = "wecure-refresh-token";
export const AUTH_USER_KEY = "wecure-user";

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

export function saveAuthSession(input: {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser | null;
}) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, input.accessToken);
  if (input.refreshToken) {
    window.localStorage.setItem(AUTH_REFRESH_KEY, input.refreshToken);
  }
  if (input.user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(input.user));
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_REFRESH_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(AUTH_USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}
