import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { AppException, AuthErrorCode } from '../common/app.exception';
import { AuditEvent, Role } from '../security/enums';
import { AUTH_STORE, AuthStore } from './auth.store';
import { AccessPrincipal, SessionRecord, UserRecord } from './auth.types';
import { AuthResponse, CurrentUserResponse, LoginRequest, RegisterRequest } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly accessSeconds = 900;
  private readonly dummyHashPromise = argon2.hash('not-a-real-password-for-constant-work');
  constructor(@Inject(AUTH_STORE) private readonly store: AuthStore, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async register(input: RegisterRequest, correlationId: string): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();
    if (await this.store.findUserByEmail(email)) throw new AppException(AuthErrorCode.EMAIL_UNAVAILABLE, 'Registration cannot be completed with these details.', HttpStatus.CONFLICT);
    const user = await this.store.createUser({ id: randomUUID(), email, displayName: input.displayName.trim(), passwordHash: await argon2.hash(input.password, { type: argon2.argon2id }), role: Role.CONSUMER });
    await this.audit(user.id, AuditEvent.USER_REGISTERED, correlationId);
    return this.issueSession(user);
  }

  async login(input: LoginRequest, correlationId: string): Promise<AuthResponse> {
    const user = await this.store.findUserByEmail(input.email.trim().toLowerCase());
    const valid = await argon2.verify(user?.passwordHash ?? await this.dummyHashPromise, input.password).catch(() => false);
    if (!user || !valid) {
      await this.audit(null, AuditEvent.AUTHENTICATION_FAILED, correlationId);
      throw new AppException(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid email or password.', HttpStatus.UNAUTHORIZED);
    }
    await this.audit(user.id, AuditEvent.AUTHENTICATION_SUCCEEDED, correlationId);
    return this.issueSession(user);
  }

  async refresh(refreshToken: string, correlationId: string): Promise<AuthResponse> {
    const parsed = this.parseRefreshToken(refreshToken);
    const session = await this.store.findSession(parsed.sessionId);
    if (!session || session.revokedAt || session.expiresAt <= new Date()) throw this.invalidSession();
    const expectedHash = this.hash(refreshToken);
    if (session.refreshTokenHash !== expectedHash) throw this.invalidSession();
    const user = await this.store.findUserById(session.userId);
    if (!user) throw this.invalidSession();
    const nextRefresh = this.createRefreshToken(session.id);
    const expiresAt = this.refreshExpiry();
    if (!await this.store.rotateSession(session.id, expectedHash, this.hash(nextRefresh), expiresAt)) throw this.invalidSession();
    await this.audit(user.id, AuditEvent.TOKEN_REFRESHED, correlationId, { sessionId: session.id });
    return this.authResponse(user, { ...session, refreshTokenHash: this.hash(nextRefresh), expiresAt, lastRotatedAt: new Date() }, nextRefresh);
  }

  async logout(principal: AccessPrincipal, correlationId: string): Promise<{ loggedOut: true }> {
    if (!await this.store.revokeSession(principal.sessionId)) throw new AppException(AuthErrorCode.SESSION_REVOKED, 'Session is already inactive.', HttpStatus.UNAUTHORIZED);
    await this.audit(principal.sub, AuditEvent.SESSION_LOGGED_OUT, correlationId, { sessionId: principal.sessionId });
    return { loggedOut: true };
  }

  async me(principal: AccessPrincipal): Promise<CurrentUserResponse> {
    const [user, session] = await Promise.all([this.store.findUserById(principal.sub), this.store.findSession(principal.sessionId)]);
    if (!user || !session || session.revokedAt || session.expiresAt <= new Date()) throw this.invalidSession();
    return { user: this.publicUser(user), session: this.sessionSummary(session) };
  }

  private async issueSession(user: UserRecord): Promise<AuthResponse> {
    const id = randomUUID();
    const refreshToken = this.createRefreshToken(id);
    const session = await this.store.createSession({ id, userId: user.id, refreshTokenHash: this.hash(refreshToken), expiresAt: this.refreshExpiry() });
    return this.authResponse(user, session, refreshToken);
  }
  private authResponse(user: UserRecord, session: SessionRecord, refreshToken: string): AuthResponse {
    const principal: AccessPrincipal = { sub: user.id, role: user.role, sessionId: session.id };
    return { accessToken: this.jwt.sign(principal, { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), expiresIn: this.config.get<string>('JWT_ACCESS_TTL', '15m') as never }), refreshToken, expiresIn: this.accessSeconds, user: this.publicUser(user), session: this.sessionSummary(session) };
  }
  private publicUser(user: UserRecord) { const [name, domain = ''] = user.email.split('@'); return { id: user.id, displayName: user.displayName, maskedEmail: `${name.slice(0, 2)}***@${domain}`, role: user.role }; }
  private sessionSummary(session: SessionRecord) { return { id: session.id, createdAt: session.createdAt.toISOString(), expiresAt: session.expiresAt.toISOString() }; }
  private createRefreshToken(sessionId: string) { return `${sessionId}.${randomBytes(48).toString('base64url')}`; }
  private parseRefreshToken(value: string) { const [sessionId, secret] = value.split('.'); if (!sessionId || !secret || secret.length < 32) throw this.invalidSession(); return { sessionId }; }
  private hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
  private refreshExpiry() { return new Date(Date.now() + this.config.get<number>('REFRESH_TOKEN_TTL_SECONDS', 2592000) * 1000); }
  private invalidSession() { return new AppException(AuthErrorCode.SESSION_INVALID, 'Refresh session is invalid or expired.', HttpStatus.UNAUTHORIZED); }
  private async audit(actorId: string | null, event: AuditEvent, correlationId: string, metadata: Record<string, string> = {}) { await this.store.addAudit({ actorId, event, correlationId, metadata }); }
}
