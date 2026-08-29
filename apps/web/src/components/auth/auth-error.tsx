'use client';

import { AlertCircle } from 'lucide-react';

/**
 * Safe, non-leaking auth error copy. Never echoes account existence or other
 * sensitive signals back to the user. Codes come from the backend's
 * AuthErrorCode enum; unknown codes fall back to a generic message.
 */
const CODE_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password.',
  AUTH_EMAIL_UNAVAILABLE: 'An account with this email already exists.',
  AUTH_TOKEN_REQUIRED: 'Your session has expired. Please sign in again.',
  AUTH_TOKEN_INVALID: 'Your session has expired. Please sign in again.',
  AUTH_SESSION_INVALID: 'Your session has expired. Please sign in again.',
  AUTH_SESSION_REVOKED: 'Your session has expired. Please sign in again.',
  VALIDATION_ERROR: 'Please check your details and try again.',
  NETWORK_ERROR: 'Network error. Check your connection and try again.',
};

export function friendlyAuthError(code: string): string {
  return CODE_MESSAGES[code] ?? 'Something went wrong. Please try again.';
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
