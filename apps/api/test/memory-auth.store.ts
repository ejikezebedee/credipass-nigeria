import { randomUUID } from 'node:crypto';
import { AuthStore } from '../src/auth/auth.store';
import { AuditRecord, SessionRecord, UserRecord } from '../src/auth/auth.types';

export class MemoryAuthStore implements AuthStore {
  readonly users = new Map<string, UserRecord>();
  readonly sessions = new Map<string, SessionRecord>();
  readonly audits: AuditRecord[] = [];
  async findUserByEmail(email: string) { return [...this.users.values()].find((user) => user.email === email) ?? null; }
  async findUserById(id: string) { return this.users.get(id) ?? null; }
  async createUser(input: Omit<UserRecord, 'createdAt'>) { const user = { ...input, createdAt: new Date() }; this.users.set(user.id, user); return user; }
  async createSession(input: Omit<SessionRecord, 'createdAt' | 'lastRotatedAt' | 'revokedAt'>) { const now = new Date(); const session = { ...input, createdAt: now, lastRotatedAt: now, revokedAt: null }; this.sessions.set(session.id, session); return session; }
  async findSession(id: string) { return this.sessions.get(id) ?? null; }
  async rotateSession(id: string, expectedHash: string, newHash: string, expiresAt: Date) {
    const session = this.sessions.get(id);
    if (!session || session.refreshTokenHash !== expectedHash || session.revokedAt || session.expiresAt <= new Date()) return false;
    this.sessions.set(id, { ...session, refreshTokenHash: newHash, expiresAt, lastRotatedAt: new Date() });
    return true;
  }
  async revokeSession(id: string) { const session = this.sessions.get(id); if (!session || session.revokedAt) return false; this.sessions.set(id, { ...session, revokedAt: new Date() }); return true; }
  async addAudit(input: Omit<AuditRecord, 'id' | 'createdAt'>) { const audit = { ...input, id: randomUUID(), createdAt: new Date() }; this.audits.push(audit); return audit; }
}
