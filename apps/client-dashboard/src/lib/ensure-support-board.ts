import { ensureBoard } from '@gate-access/db';

/** Lazily provision a single SUPPORT board per org for client-dashboard tasks. */
export function ensureSupportBoard(organizationId: string) {
  return ensureBoard(organizationId, 'SUPPORT', 'General Tasks');
}
