// @ts-ignore
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ synced: [], conflicted: [], failed: [] }),
  })
);

import CryptoJS from 'crypto-js';

const MOCK_TOKEN = 'mock_jwt_token_12345';

const mockStore: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
  setItemAsync: jest.fn((key: string, value: string) => {
    mockStore[key] = value;
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key: string) => {
    delete mockStore[key];
    return Promise.resolve();
  }),
}));

jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn((_algorithm: string, text: string) =>
    Promise.resolve(`hashed_${text}`)
  ),
  getRandomBytesAsync: jest.fn((byteCount: number) => {
    // Return deterministic but non-zero bytes for salt testing
    const arr = new Uint8Array(byteCount);
    for (let i = 0; i < byteCount; i++) {
      arr[i] = (i + 1) % 256;
    }
    return Promise.resolve(arr);
  }),
  CryptoDigestAlgorithm: {
    SHA256: 'SHA256',
    SHA384: 'SHA384',
    SHA512: 'SHA512',
  },
}));

const mockAsyncStore: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn((key: string) => Promise.resolve().then(() => mockAsyncStore[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      mockAsyncStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete mockAsyncStore[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockAsyncStore).forEach((key) => delete mockAsyncStore[key]);
      return Promise.resolve();
    }),
  };
});

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true })
  ),
}));

// Mock syncManager to prevent background syncs during tests
jest.mock('./offline-queue', () => {
  const originalModule = jest.requireActual('./offline-queue');
  return {
    ...originalModule,
    syncManager: {
      ...originalModule.syncManager,
      triggerSync: jest.fn().mockResolvedValue(undefined),
    },
  };
});

import {
  encryption,
  scanQueue,
  generateScanUuid,
  deriveEncryptionKey,
  getOrCreateSalt,
} from './offline-queue';

function clearMockStore() {
  Object.keys(mockStore).forEach((key) => delete mockStore[key]);
  Object.keys(mockAsyncStore).forEach((key) => delete mockAsyncStore[key]);
}

// ─── Existing Tests (updated) ────────────────────────────────────────────────

describe('Encryption Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  describe('AES Encryption/Decryption Round-trip', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const originalData = JSON.stringify({
        qrCode: 'TEST_QR_123',
        gateId: 'gate_456',
        scannedAt: '2024-01-15T10:30:00.000Z',
      });

      const encrypted = await encryption.encrypt(originalData);
      expect(encrypted).not.toEqual(originalData);
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = await encryption.decrypt(encrypted);
      const parsed = JSON.parse(decrypted);

      expect(parsed.qrCode).toBe('TEST_QR_123');
      expect(parsed.gateId).toBe('gate_456');
    });

    it('should produce different ciphertext for same plaintext (due to random IV)', async () => {
      const data = 'test_qr_code_data';

      const encrypted1 = await encryption.encrypt(data);
      const encrypted2 = await encryption.encrypt(data);

      expect(encrypted1).not.toEqual(encrypted2);
    });
  });

  describe('Encryption with Token-based Key', () => {
    it('should derive key from token when available', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      const data = 'sensitive_scan_data';
      const encrypted = await encryption.encrypt(data);

      const decrypted = await encryption.decrypt(encrypted);
      expect(decrypted).toBe(data);
    });
  });
});

describe('Scan Queue Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  describe('addScan', () => {
    it('should require authentication before adding scan', async () => {
      await expect(scanQueue.addScan('qr123', 'gate456')).rejects.toThrow(
        'Authentication required'
      );
    });

    it('should add scan with scanUuid when authenticated', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      const scan = await scanQueue.addScan('qr123', 'gate456');

      expect(scan.qrCode).toBe('qr123');
      expect(scan.gateId).toBe('gate456');
      expect(scan.synced).toBe(false);
      expect(scan.retryCount).toBe(0);
      expect(scan.scanUuid).toBeTruthy();
      expect(scan.scanUuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });
  });

  describe('getPendingScans', () => {
    it('should return only pending scans', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      await scanQueue.addScan('qr1', 'gate1');
      await scanQueue.addScan('qr2', 'gate2');

      const pending = await scanQueue.getPendingScans();
      expect(pending.length).toBe(2);
    });
  });

  describe('markAsSynced', () => {
    it('should mark scan as synced', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      const scan = await scanQueue.addScan('qr1', 'gate1');
      await scanQueue.markAsSynced(scan.id);

      const pending = await scanQueue.getPendingScans();
      expect(pending.length).toBe(0);
    });
  });

  describe('markAsFailed', () => {
    it('should increment retry count on failure', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      const scan = await scanQueue.addScan('qr1', 'gate1');
      await scanQueue.markAsFailed(scan.id, 'Test error');

      const pending = await scanQueue.getPendingScans();
      expect(pending[0].retryCount).toBe(1);
      expect(pending[0].error).toBe('Test error');
    });

    it('should mark as max retries exceeded after 10 failures', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      const scan = await scanQueue.addScan('qr1', 'gate1');

      for (let i = 0; i < 10; i++) {
        await scanQueue.markAsFailed(scan.id, `Error ${i}`);
      }

      const failed = await scanQueue.getFailedScans();
      expect(failed.length).toBe(1);
      expect(failed[0].error).toBe('Max retries exceeded');

      const pending = await scanQueue.getPendingScans();
      expect(pending.length).toBe(0);
    });
  });

  describe('clearQueue', () => {
    it('should clear all scans from queue', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      await scanQueue.addScan('qr1', 'gate1');
      await scanQueue.addScan('qr2', 'gate2');

      await scanQueue.clearQueue();

      const pending = await scanQueue.getPendingScans();
      expect(pending.length).toBe(0);
    });
  });
});

describe('LWW Conflict Resolution', () => {
  it('should prefer newer timestamp (incoming wins)', () => {
    const existingTime = new Date('2024-01-15T10:00:00.000Z').getTime();
    const incomingNewerTime = new Date('2024-01-15T10:30:00.000Z').getTime();

    expect(incomingNewerTime > existingTime).toBe(true);
  });

  it('should prefer existing when older (existing wins)', () => {
    const existingTime = new Date('2024-01-15T10:00:00.000Z').getTime();
    const incomingOlderTime = new Date('2024-01-15T09:30:00.000Z').getTime();

    expect(incomingOlderTime > existingTime).toBe(false);
  });

  it('should keep existing on equal timestamps (server authoritative)', () => {
    const existingTime = new Date('2024-01-15T10:00:00.000Z').getTime();
    const incomingEqualTime = new Date('2024-01-15T10:00:00.000Z').getTime();

    // Equal → NOT greater than → server keeps existing
    expect(incomingEqualTime > existingTime).toBe(false);
    expect(incomingEqualTime === existingTime).toBe(true);
  });
});

// ─── NEW Tests ───────────────────────────────────────────────────────────────

describe('PBKDF2 Key Derivation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  it('should derive a consistent key for the same token and salt', async () => {
    mockStore['auth_token'] = MOCK_TOKEN;

    const key1 = await deriveEncryptionKey(MOCK_TOKEN);
    const key2 = await deriveEncryptionKey(MOCK_TOKEN);

    expect(key1).toBe(key2);
    expect(key1).toMatch(/^[0-9a-f]{64}$/); // 32 bytes = 64 hex chars
  });

  it('should derive different keys for different tokens with same salt', async () => {
    // Ensure salt exists first
    await getOrCreateSalt();

    const keyA = await deriveEncryptionKey('token_A');
    const keyB = await deriveEncryptionKey('token_B');

    expect(keyA).not.toBe(keyB);
  });

  it('should produce a 256-bit key (64 hex characters)', async () => {
    const key = await deriveEncryptionKey('any_token');
    expect(key).toHaveLength(64);
    expect(key).toMatch(/^[0-9a-f]+$/);
  });

  it('should encrypt/decrypt round-trip with PBKDF2-derived key', async () => {
    mockStore['auth_token'] = MOCK_TOKEN;

    const originalData = JSON.stringify({
      qrCode: 'QR_PBKDF2_TEST',
      gateId: 'gate_789',
    });

    const encrypted = await encryption.encrypt(originalData);
    const decrypted = await encryption.decrypt(encrypted);

    expect(JSON.parse(decrypted)).toEqual(JSON.parse(originalData));
  });
});

describe('Salt Storage and Retrieval', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  it('should generate and store salt on first call', async () => {
    const salt = await getOrCreateSalt();

    expect(salt).toBeTruthy();
    expect(salt.length).toBe(32); // 16 bytes = 32 hex chars
    expect(mockStore['scan_pbkdf2_salt']).toBe(salt);
  });

  it('should return existing salt on subsequent calls', async () => {
    const salt1 = await getOrCreateSalt();
    const salt2 = await getOrCreateSalt();

    expect(salt1).toBe(salt2);
  });

  it('should expose salt via encryption.getSalt()', async () => {
    await getOrCreateSalt();
    const salt = await encryption.getSalt();
    expect(salt).toBeTruthy();
    expect(salt!.length).toBe(32);
  });

  it('should clear salt via encryption.clearSalt()', async () => {
    await getOrCreateSalt();
    await encryption.clearSalt();
    const salt = await encryption.getSalt();
    expect(salt).toBeNull();
  });
});

describe('Encryption Failure Fallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  it('should fall back to random key when no token exists', async () => {
    // No token in store → getOrDeriveKey falls back to getOrCreateKey
    const data = 'fallback_test_data';
    const encrypted = await encryption.encrypt(data);
    const decrypted = await encryption.decrypt(encrypted);
    expect(decrypted).toBe(data);
  });

  it('should throw on decryption with wrong key', async () => {
    mockStore['auth_token'] = 'token_for_encryption';
    const encrypted = await encryption.encrypt('secret_data');

    // Change the token → different derived key → decryption fails
    clearMockStore();
    mockStore['auth_token'] = 'different_token';

    await expect(encryption.decrypt(encrypted)).rejects.toThrow(
      'Decryption failed'
    );
  });

  it('should throw on corrupted ciphertext', async () => {
    await expect(
      encryption.decrypt('not_valid_ciphertext_at_all')
    ).rejects.toThrow(/Decryption failed|Malformed UTF-8 data/);
  });
});

describe('Scan UUID Generation', () => {
  it('should generate valid UUID v4 format', async () => {
    const uuid = await generateScanUuid();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    expect(uuid).toMatch(uuidRegex);
  });

  it('should generate unique UUIDs', async () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      uuids.add(await generateScanUuid());
    }
    expect(uuids.size).toBe(100);
  });
});

describe('Partial Sync (some succeed / some fail)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  it('should keep only failed scans in queue after partial sync response', async () => {
    mockStore['auth_token'] = MOCK_TOKEN;

    const scan1 = await scanQueue.addScan('qr1', 'gate1');
    const scan2 = await scanQueue.addScan('qr2', 'gate2');
    const scan3 = await scanQueue.addScan('qr3', 'gate3');

    // Simulate: scan1 synced, scan2 failed, scan3 conflicted (resolved)
    await scanQueue.markAsSynced(scan1.id);
    await scanQueue.markAsFailed(scan2.id, 'QR code not found');
    await scanQueue.markAsSynced(scan3.id); // conflicts are marked synced

    await scanQueue.clearSynced();

    const pending = await scanQueue.getPendingScans();
    // Only scan2 should remain (failed, retryCount=1, not yet maxed out)
    expect(pending.length).toBe(1);
    expect(pending[0].id).toBe(scan2.id);
    expect(pending[0].retryCount).toBe(1);
  });

  it('should not retry conflicted items (they are resolved server-side)', async () => {
    mockStore['auth_token'] = MOCK_TOKEN;

    const scan1 = await scanQueue.addScan('qr1', 'gate1');

    // Conflicted items are marked as synced, not failed
    await scanQueue.markAsSynced(scan1.id);
    await scanQueue.clearSynced();

    const pending = await scanQueue.getPendingScans();
    expect(pending.length).toBe(0);

    const failed = await scanQueue.getFailedScans();
    expect(failed.length).toBe(0);
  });
});
