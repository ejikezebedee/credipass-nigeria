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
