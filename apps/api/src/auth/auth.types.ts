import { AuditEvent, Role } from '../security/enums';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  createdAt: Date;
}

export interface SessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  lastRotatedAt: Date;
  revokedAt: Date | null;
}

export interface AuditRecord {
  id: string;
  actorId: string | null;
  event: AuditEvent;
  correlationId: string;
  metadata: Record<string, string>;
  createdAt: Date;
}

export interface AccessPrincipal { sub: string; role: Role; sessionId: string; }
