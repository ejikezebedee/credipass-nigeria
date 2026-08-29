/**
 * Isolated mock data (blueprint rule: mock data must stay under src/lib/mock
 * and is replaced endpoint-by-endpoint after typed API integration).
 *
 * Sprint 1 uses NO mock — auth is fully integrated against the real backend.
 * Later sprint screens may add mock here; each must be flagged and removed as
 * its endpoint is integrated.
 */
export const MOCK_ENABLED = false;

export type MockNotice = 'integrated' | 'mock';

/** Marks whether a given screen is still backed by mock data. */
export function screenBacking(): MockNotice {
  return MOCK_ENABLED ? 'mock' : 'integrated';
}
