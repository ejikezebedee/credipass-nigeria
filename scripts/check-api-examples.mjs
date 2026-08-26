import { readFile } from 'node:fs/promises';
const contract = JSON.parse(await readFile(new URL('../docs/openapi.json', import.meta.url)));
const examples = await readFile(new URL('../docs/api-examples.md', import.meta.url), 'utf8');
const missing = [];
for (const path of Object.values(contract.paths ?? {})) {
  for (const operation of Object.values(path)) {
    if (!operation || typeof operation !== 'object' || !operation.operationId) continue;
    if (!examples.includes(`## ${operation.operationId}`)) missing.push(operation.operationId);
  }
}
if (missing.length) throw new Error(`Missing API examples for operation IDs: ${missing.join(', ')}`);
console.log('API example coverage is complete.');
