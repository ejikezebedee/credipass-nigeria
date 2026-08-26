import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const temp = await mkdtemp(join(tmpdir(), 'credipass-contract-'));
const tracked = ['docs/openapi.json', 'packages/shared-types/src/generated/openapi.ts'];
try {
  for (const file of tracked) await BunlessCopy(join(root, file), join(temp, file.replaceAll('/', '__')));
  run('npm', ['run', 'contract:generate']);
  for (const file of tracked) {
    const before = await readFile(join(temp, file.replaceAll('/', '__')), 'utf8');
    const after = await readFile(join(root, file), 'utf8');
    if (before !== after) throw new Error(`${file} is stale. Run npm run contract:generate and commit the result.`);
  }
  run('npm', ['run', 'contract:examples']);
  console.log('OpenAPI contract, generated frontend types, and examples are current.');
} finally { await rm(temp, { recursive: true, force: true }); }

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
async function BunlessCopy(from, to) { const value = await readFile(from); const { writeFile } = await import('node:fs/promises'); await writeFile(to, value); }
