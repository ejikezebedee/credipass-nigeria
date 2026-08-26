import { AuditRecord, SessionRecord, UserRecord } from './auth.types';

export const AUTH_STORE = Symbol('AUTH_STORE');

export interface AuthStore {
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findUserById(id: string): Promise<UserRecord | null>;
  createUser(input: Omit<UserRecord, 'createdAt'>): Promise<UserRecord>;
  createSession(input: Omit<SessionRecord, 'createdAt' | 'lastRotatedAt' | 'revokedAt'>): Promise<SessionRecord>;
  findSession(id: string): Promise<SessionRecord | null>;
  rotateSession(id: string, expectedHash: string, newHash: string, expiresAt: Date): Promise<boolean>;
  revokeSession(id: string): Promise<boolean>;
  addAudit(input: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<AuditRecord>;
}
