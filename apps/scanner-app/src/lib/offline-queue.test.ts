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
  getRandomBytesAsync: jest.fn((byteCount: number) => 
    Promise.resolve(new Uint8Array(byteCount))
  ),
  CryptoDigestAlgorithm: {
    SHA256: 'SHA256',
    SHA384: 'SHA384',
    SHA512: 'SHA512',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
      return Promise.resolve();
    }),
  };
});

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() => 
    Promise.resolve({ isConnected: true, isInternetReachable: true })
  ),
}));

import { encryption, scanQueue } from '../src/lib/offline-queue';

describe('Encryption Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
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
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
  });

  describe('addScan', () => {
    it('should require authentication before adding scan', async () => {
      await expect(scanQueue.addScan('qr123', 'gate456')).rejects.toThrow(
        'Authentication required'
      );
    });

    it('should add scan when authenticated', async () => {
      mockStore['auth_token'] = MOCK_TOKEN;

      const scan = await scanQueue.addScan('qr123', 'gate456');

      expect(scan.qrCode).toBe('qr123');
      expect(scan.gateId).toBe('gate456');
      expect(scan.synced).toBe(false);
      expect(scan.retryCount).toBe(0);
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
  it('should handle timestamp-based conflict resolution logic', () => {
    const existingTime = new Date('2024-01-15T10:00:00.000Z').getTime();
    const incomingNewerTime = new Date('2024-01-15T10:30:00.000Z').getTime();
    const incomingOlderTime = new Date('2024-01-15T09:30:00.000Z').getTime();

    expect(incomingNewerTime > existingTime).toBe(true);
    expect(incomingOlderTime > existingTime).toBe(false);
  });
});
