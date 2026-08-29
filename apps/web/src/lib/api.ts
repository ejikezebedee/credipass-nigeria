import type { components } from '@credipass/shared-types';

/**
 * Typed API client for the CrediPass Nigeria backend.
 * All types come from @credipass/shared-types, generated from docs/openapi.json.
 * The OpenAPI contract is the single source of truth — no field is invented here.
 */

export type RegisterRequest = components['schemas']['RegisterRequest'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type RefreshRequest = components['schemas']['RefreshRequest'];
export type AuthResponse = components['schemas']['AuthResponse'];
export type AuthUserDto = components['schemas']['AuthUserDto'];
export type Role = components['schemas']['Role'];

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  meta?: { correlationId: string; timestamp: string; path?: string };
}

export class ApiRequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    envelope = null;
  }

  if (!res.ok || !envelope || envelope.success === false) {
    const code = envelope?.error?.code ?? 'NETWORK_ERROR';
    const message =
      envelope?.error?.message ?? `Request failed (HTTP ${res.status})`;
    throw new ApiRequestError(code, message, res.status);
  }

  return envelope.data as T;
}

export const api = {
  register: (body: RegisterRequest) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: LoginRequest) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  refresh: (body: RefreshRequest) =>
    request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: (accessToken: string) =>
    request<void>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  me: (accessToken: string) =>
    request<AuthUserDto>('/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
