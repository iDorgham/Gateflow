/**
 * Tenant IP allow-list engine.
 *
 * Pure, dependency-free matcher for validating and evaluating per-tenant IP
 * allow-lists. Supports plain IPv4/IPv6 addresses and CIDR ranges, plus an
 * explicit `*` (allow all) wildcard.
 *
 * Empty list semantics: an allow-list that has no entries does NOT restrict —
 * it is treated as "no allow-list configured" (allow). Only a non-empty list
 * enforces deny-by-default. To deny everything, use the reserved entry `none`.
 */

import { createHash } from 'node:crypto';

export const WILDCARD_ALLOW = '*';
export const DENY_ALL = 'none';

/** Map an IP string to a 16-byte IPv6-style binary buffer (v4-mapped), or null. */
export function ipToBuffer(ip: string): Uint8Array | null {
  const normalized = ip.trim();
  if (normalized.includes(':')) return expandIpv6(normalized);
  return ipv4ToMapped(normalized);
}

function ipv4ToMapped(ip: string): Uint8Array | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  const octets = new Array<number>(4);
  for (let i = 0; i < 4; i++) {
    const n = Number(parts[i]);
    if (!/^\d{1,3}$/.test(parts[i]) || n < 0 || n > 255) return null;
    octets[i] = n;
  }
  const buf = new Uint8Array(16);
  buf[10] = 0xff;
  buf[11] = 0xff;
  buf[12] = octets[0];
  buf[13] = octets[1];
  buf[14] = octets[2];
  buf[15] = octets[3];
  return buf;
}

function expandIpv6(input: string): Uint8Array | null {
  let s = input.trim();

  // Expand trailing embedded IPv4 (e.g. ::ffff:1.2.3.4 → ::ffff:0102:0304)
  if (s.includes('.')) {
    const lastColon = s.lastIndexOf(':');
    const quadStr = s.slice(lastColon + 1);
    const octets = quadStr.split('.').map(Number);
    if (
      octets.length !== 4 ||
      octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)
    ) {
      return null;
    }
    const group1 = (octets[0] << 8) | octets[1];
    const group2 = (octets[2] << 8) | octets[3];
    s = `${s.slice(0, lastColon + 1)}${group1.toString(16)}:${group2.toString(16)}`;
  }

  if (!/^[0-9a-fA-F:]+$/.test(s) || s.includes('.')) return null;

  const dbl = s.indexOf('::');
  let leftStr = s;
  let rightStr = '';
  if (dbl !== -1) {
    leftStr = s.slice(0, dbl);
    rightStr = s.slice(dbl + 2);
  }
  const left = leftStr === '' ? [] : leftStr.split(':');
  const right = rightStr === '' ? [] : rightStr.split(':');
  if (left.length + right.length > 8) return null;

  const fill = 8 - left.length - right.length;
  const groupsStr = [...left, ...Array(fill).fill('0'), ...right];
  const buf = new Uint8Array(16);
  for (let i = 0; i < 8; i++) {
    const g = groupsStr[i];
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    const v = parseInt(g, 16);
    if (Number.isNaN(v)) return null;
    buf[i * 2] = v >> 8;
    buf[i * 2 + 1] = v & 0xff;
  }
  return buf;
}

function cidrParse(
  cidr: string
): { network: Uint8Array; prefix: number } | null {
  const idx = cidr.indexOf('/');
  if (idx === -1) {
    const buf = ipToBuffer(cidr);
    return buf
      ? { network: buf, prefix: buf.some((b) => b !== 0) ? 128 : 0 }
      : null;
  }
  const ip = cidr.slice(0, idx);
  const prefixNum = Number(cidr.slice(idx + 1));
  const buf = ipToBuffer(ip);
  if (!buf) return null;
  const max = buf[10] === 0xff && buf[11] === 0xff ? 32 : 128;
  if (!Number.isInteger(prefixNum) || prefixNum < 0 || prefixNum > max)
    return null;
  if (buf[10] === 0xff && buf[11] === 0xff) {
    // Express IPv4 CIDR with 32-bit prefix in v4-mapped 128-bit form
    const network = ipv4ToMapped(`${ip}`) ?? buf;
    return { network, prefix: 96 + prefixNum };
  }
  return { network: buf, prefix: prefixNum };
}

/** Does byte-array `ip` fall within `cidr` range? */
export function ipMatchesCidr(ip: Uint8Array, cidr: string): boolean {
  const parsed = cidrParse(cidr);
  if (!parsed) return false;
  const { network, prefix } = parsed;
  const fullBytes = Math.floor(prefix / 8);
  const remBits = prefix % 8;
  for (let i = 0; i < fullBytes; i++) {
    if (ip[i] !== network[i]) return false;
  }
  if (remBits > 0) {
    const mask = 0xff << (8 - remBits);
    if ((ip[fullBytes] & mask) !== (network[fullBytes] & mask)) return false;
  }
  return true;
}

export interface AllowListNormalization {
  valid: boolean;
  entries: string[];
  errors: string[];
}

/**
 * Validate + normalize allow-list entries. Returns the canonical entries list
 * and any per-entry errors. Invalid entries are rejected; valid ones retained.
 */
export function normalizeAllowList(entries: unknown): AllowListNormalization {
  if (!Array.isArray(entries)) {
    return {
      valid: false,
      entries: [],
      errors: ['Allow list must be an array'],
    };
  }
  const errors: string[] = [];
  const normalized: string[] = [];
  entries.forEach((entryRaw, i) => {
    if (typeof entryRaw !== 'string') {
      errors.push(`Entry ${i + 1}: must be a string`);
      return;
    }
    const e = entryRaw.trim().toLowerCase();
    if (!e) return;
    if (e === WILDCARD_ALLOW || e === DENY_ALL) {
      normalized.push(e);
      return;
    }
    if (cidrParse(e)) {
      normalized.push(entryRaw.trim());
      return;
    }
    errors.push(`Entry ${i + 1} (${entryRaw}): invalid IP or CIDR`);
  });
  return { valid: errors.length === 0, entries: normalized, errors };
}

/**
 * Evaluate whether `ip` is permitted by the allow-list.
 *  - empty list → true (no allow-list configured)
 *  - `*` → true (allow all)
 *  - `none` → false (deny all)
 *  - otherwise, true only when the IP matches an entry.
 */
export function isIpAllowed(ip: string, allowList: string[]): boolean {
  const list = Array.isArray(allowList) ? allowList : [];
  if (list.length === 0) return true;
  if (list.includes(DENY_ALL)) return false;
  if (list.includes(WILDCARD_ALLOW)) return true;

  const ipBuf = ipToBuffer(ip);
  if (!ipBuf) return false;
  return list.some((entry) => {
    const e = entry.trim().toLowerCase();
    if (e === WILDCARD_ALLOW) return true;
    if (e.includes('/')) {
      return ipMatchesCidr(ipBuf, e);
    }
    const target = ipToBuffer(e);
    if (!target) return false;
    return ipBuf.every((b, i) => b === target[i]);
  });
}

/** Stable, short fingerprint of the allow-list for caching/versioning. */
export function allowListFingerprint(allowList: string[]): string {
  return createHash('sha256')
    .update([...allowList].sort().join(','))
    .digest('hex')
    .slice(0, 12);
}
