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
