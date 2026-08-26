process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_ACCESS_SECRET = 'test-secret-that-is-at-least-32-characters';
process.env.JWT_ACCESS_TTL = '15m';
process.env.REFRESH_TOKEN_TTL_SECONDS = '2592000';
