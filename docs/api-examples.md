# API examples

Every documented operation must have at least one request/response example here. The CI examples gate checks operation IDs against these headings.

## health

Request:

```http
GET /health HTTP/1.1
X-Correlation-Id: demo-request-001
```

Response `200`:

```json
{
  "success": true,
  "data": { "status": "ok", "service": "credipass-api", "version": "0.1.0" },
  "meta": { "correlationId": "demo-request-001", "timestamp": "2026-08-26T00:00:00.000Z" }
}
```

## register

```http
POST /auth/register HTTP/1.1
Content-Type: application/json
X-Correlation-Id: register-001

{"email":"new.user@example.test","password":"Correct-Horse-47!","displayName":"New User"}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "accessToken": "<short-lived-jwt>",
    "refreshToken": "<opaque-rotating-refresh-token>",
    "expiresIn": 900,
    "user": { "id": "user_001", "displayName": "New User", "maskedEmail": "ne***@example.test", "role": "CONSUMER" },
    "session": { "id": "session_001", "createdAt": "2026-08-26T00:00:00.000Z", "expiresAt": "2026-09-25T00:00:00.000Z" }
  },
  "meta": { "correlationId": "register-001", "timestamp": "2026-08-26T00:00:00.000Z" }
}
```

## login

```http
POST /auth/login HTTP/1.1
Content-Type: application/json

{"email":"new.user@example.test","password":"Correct-Horse-47!"}
```

Response `200` uses the same wrapped `AuthResponse` as registration. Unknown emails and incorrect passwords both return:

```json
{
  "success": false,
  "error": { "code": "AUTH_INVALID_CREDENTIALS", "message": "Invalid email or password." },
  "meta": { "correlationId": "request-001", "timestamp": "2026-08-26T00:00:00.000Z", "path": "/auth/login" }
}
```

## refresh

```http
POST /auth/refresh HTTP/1.1
Content-Type: application/json

{"refreshToken":"session-id.opaque-secret"}
```

Response `200` returns a new access token and a new refresh token. The submitted refresh token is invalid immediately after successful rotation.

## logout

```http
POST /auth/logout HTTP/1.1
Authorization: Bearer <access-token>
```

Response `200`:

```json
{
  "success": true,
  "data": { "loggedOut": true },
  "meta": { "correlationId": "request-001", "timestamp": "2026-08-26T00:00:00.000Z" }
}
```

## me

```http
GET /me HTTP/1.1
Authorization: Bearer <access-token>
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "user": { "id": "user_001", "displayName": "New User", "maskedEmail": "ne***@example.test", "role": "CONSUMER" },
    "session": { "id": "session_001", "createdAt": "2026-08-26T00:00:00.000Z", "expiresAt": "2026-09-25T00:00:00.000Z" }
  },
  "meta": { "correlationId": "request-001", "timestamp": "2026-08-26T00:00:00.000Z" }
}
```
