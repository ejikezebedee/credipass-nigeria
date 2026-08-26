import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../infrastructure/prisma.service';
import { AuditEvent, Role } from '../security/enums';
import { AuthStore } from './auth.store';
import { AuditRecord, SessionRecord, UserRecord } from './auth.types';

@Injectable()
export class PrismaAuthStore implements AuthStore {
  constructor(private readonly prisma: PrismaService) {}
  async findUserByEmail(email: string): Promise<UserRecord | null> { return this.prisma.user.findUnique({ where: { email } }) as Promise<UserRecord | null>; }
  async findUserById(id: string): Promise<UserRecord | null> { return this.prisma.user.findUnique({ where: { id } }) as Promise<UserRecord | null>; }
  async createUser(input: Omit<UserRecord, 'createdAt'>): Promise<UserRecord> { return this.prisma.user.create({ data: input }) as Promise<UserRecord>; }
  async createSession(input: Omit<SessionRecord, 'createdAt' | 'lastRotatedAt' | 'revokedAt'>): Promise<SessionRecord> { return this.prisma.authSession.create({ data: input }) as Promise<SessionRecord>; }
  async findSession(id: string): Promise<SessionRecord | null> { return this.prisma.authSession.findUnique({ where: { id } }) as Promise<SessionRecord | null>; }
  async rotateSession(id: string, expectedHash: string, newHash: string, expiresAt: Date): Promise<boolean> {
    const result = await this.prisma.authSession.updateMany({ where: { id, refreshTokenHash: expectedHash, revokedAt: null, expiresAt: { gt: new Date() } }, data: { refreshTokenHash: newHash, expiresAt, lastRotatedAt: new Date() } });
    return result.count === 1;
  }
  async revokeSession(id: string): Promise<boolean> {
    const result = await this.prisma.authSession.updateMany({ where: { id, revokedAt: null }, data: { revokedAt: new Date() } });
    return result.count === 1;
  }
  async addAudit(input: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<AuditRecord> {
    return this.prisma.auditLog.create({ data: { actorId: input.actorId, event: input.event as never, correlationId: input.correlationId, metadata: input.metadata as Prisma.InputJsonValue } }) as unknown as Promise<AuditRecord>;
  }
}
