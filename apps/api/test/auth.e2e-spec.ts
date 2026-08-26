import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AUTH_STORE } from '../src/auth/auth.store';
import { configureApplication } from '../src/bootstrap';
import { AuditEvent } from '../src/security/enums';
import { MemoryAuthStore } from './memory-auth.store';

describe('Auth + Current User contract', () => {
  let app: INestApplication;
  let store: MemoryAuthStore;
  const registration = { email: 'test.user@example.test', password: 'Correct-Horse-47!', displayName: 'Test User' };

  beforeEach(async () => {
    store = new MemoryAuthStore();
    const module = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(AUTH_STORE).useValue(store).compile();
    app = module.createNestApplication();
    configureApplication(app);
    await app.init();
  });
  afterEach(() => app.close());
  const register = () => request(app.getHttpServer()).post('/auth/register').set('x-correlation-id', 'auth-test').send(registration);

  it('register success omits password and token hashes', async () => {
    const response = await register().expect(201);
    expect(response.body.data.user).toMatchObject({ role: 'CONSUMER', displayName: 'Test User' });
    expect(JSON.stringify(response.body)).not.toMatch(/passwordHash|refreshTokenHash/);
  });

  it('uses the standard taxonomy for invalid auth input', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register').send({ email: 'invalid', password: 'short', displayName: '' }).expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.meta.correlationId).toBeTruthy();
  });

  it('login success returns a tracked session', async () => {
    await register();
    const response = await request(app.getHttpServer()).post('/auth/login').send({ email: registration.email, password: registration.password }).expect(200);
    expect(store.sessions.has(response.body.data.session.id)).toBe(true);
  });

  it('login failure is identical for unknown email and wrong password', async () => {
    await register();
    const unknown = await request(app.getHttpServer()).post('/auth/login').send({ email: 'unknown@example.test', password: 'Wrong-Password-47!' }).expect(401);
    const wrong = await request(app.getHttpServer()).post('/auth/login').send({ email: registration.email, password: 'Wrong-Password-47!' }).expect(401);
    expect(unknown.body.error).toEqual(wrong.body.error);
    expect(unknown.body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('refresh rotates the token and rejects replay of the old token', async () => {
    const registered = await register();
    const first = registered.body.data.refreshToken;
    const rotated = await request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken: first }).expect(200);
    expect(rotated.body.data.refreshToken).not.toBe(first);
    await request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken: first }).expect(401);
  });

  it('logout invalidates the session', async () => {
    const registered = await register();
    const token = registered.body.data.accessToken;
    await request(app.getHttpServer()).post('/auth/logout').set('Authorization', `Bearer ${token}`).expect(200);
    await request(app.getHttpServer()).get('/me').set('Authorization', `Bearer ${token}`).expect(401);
  });

  it('GET /me requires authentication', async () => { await request(app.getHttpServer()).get('/me').expect(401); });

  it('GET /me returns the correct RBAC role without raw identity data', async () => {
    const registered = await register();
    const response = await request(app.getHttpServer()).get('/me').set('Authorization', `Bearer ${registered.body.data.accessToken}`).expect(200);
    expect(response.body.data.user.role).toBe('CONSUMER');
    expect(JSON.stringify(response.body)).not.toMatch(/passwordHash|refreshTokenHash|\"bvn\"|\"nin\"/i);
  });

  it('creates audit events for register, login, refresh, and logout', async () => {
    const registered = await register();
    const loggedIn = await request(app.getHttpServer()).post('/auth/login').send({ email: registration.email, password: registration.password });
    await request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken: loggedIn.body.data.refreshToken });
    await request(app.getHttpServer()).post('/auth/logout').set('Authorization', `Bearer ${registered.body.data.accessToken}`);
    expect(store.audits.map((audit) => audit.event)).toEqual(expect.arrayContaining([AuditEvent.USER_REGISTERED, AuditEvent.AUTHENTICATION_SUCCEEDED, AuditEvent.TOKEN_REFRESHED, AuditEvent.SESSION_LOGGED_OUT]));
  });
});
