import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// @ts-expect-error - Jest mock for global fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ synced: [], conflicted: [], failed: [] }),
  })
);

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

jest.mock('expo-crypto', () => {
  let callCounter = 0;
  return {
    digestStringAsync: jest.fn((_algorithm: string, text: string) =>
      Promise.resolve(`hashed_${text}`)
    ),
    getRandomBytesAsync: jest.fn((byteCount: number) => {
      callCounter += 1;
      const arr = new Uint8Array(byteCount);
      for (let i = 0; i < byteCount; i++) {
        arr[i] = (i + callCounter) % 256;
      }
      return Promise.resolve(arr);
    }),
    CryptoDigestAlgorithm: { SHA256: 'SHA256', SHA384: 'SHA384', SHA512: 'SHA512' },
  };
});

const mockAsyncStore: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
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
}));

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true })
  ),
}));

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

import { encryption, scanQueue } from './offline-queue';

function clearMockStore() {
  Object.keys(mockStore).forEach((key) => delete mockStore[key]);
  Object.keys(mockAsyncStore).forEach((key) => delete mockAsyncStore[key]);
}

describe('DEBUG: markAsFailed after 10 retries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearMockStore();
  });

  it('debug the state after 10 failures', async () => {
    mockStore['auth_token'] = MOCK_TOKEN;

    const scan = await scanQueue.addScan('qr1', 'gate1');
    console.log('After addScan:', scan);

    for (let i = 0; i < 10; i++) {
      await scanQueue.markAsFailed(scan.id, `Error ${i}`);
      console.log(`After markAsFailed ${i+1}:`);
      const queue = await (scanQueue as any).getQueue();
      console.log('  retryCount:', queue[0]?.retryCount, 'synced:', queue[0]?.synced, 'error:', queue[0]?.error);
    }

    const failed = await scanQueue.getFailedScans();
    console.log('getFailedScans result:', failed);
    console.log('failed.length:', failed.length);
  });
});
