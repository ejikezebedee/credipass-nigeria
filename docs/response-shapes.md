# Response shapes

## Success

```ts
{ success: true; data: T; meta: { correlationId: string; timestamp: string } }
```

## Error

```ts
{
  success: false;
  error: { code: string; message: string | string[] };
  meta: { correlationId: string; timestamp: string; path: string };
}
```

Raw BVN and NIN values are forbidden in public DTOs. Identity references must be masked. Risk outputs are recommendations for human review, never automatic approval or rejection decisions.

## Auth error taxonomy

- `VALIDATION_ERROR`: request fields failed DTO validation.
- `AUTH_INVALID_CREDENTIALS`: login failed; the response never reveals whether an email exists.
- `AUTH_EMAIL_UNAVAILABLE`: registration cannot be completed with the submitted details.
- `AUTH_TOKEN_REQUIRED`: bearer authentication was not supplied.
- `AUTH_TOKEN_INVALID`: access token is invalid or expired.
- `AUTH_SESSION_INVALID`: refresh session/token is invalid, expired, replayed, or unavailable.
- `AUTH_SESSION_REVOKED`: logout was requested for an inactive session.

Password hashes and refresh-token hashes are internal persistence fields and are forbidden in every response schema, example, and log. `/me` exposes only ID, display name, masked email, role, and a non-secret session summary.
