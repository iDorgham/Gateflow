import test from 'node:test';
import assert from 'node:assert/strict';

// Mock in-memory AsyncStorage for unit testing cache contract
const mockStorage = new Map();
const mockAsyncStorage = {
  getItem: async (key) => mockStorage.get(key) ?? null,
  setItem: async (key, val) => mockStorage.set(key, val),
  removeItem: async (key) => mockStorage.delete(key),
  clear: async () => mockStorage.clear(),
};

const CACHE_KEY_LIST = 'resident_visitors_list';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

async function getCachedVisitorsList() {
  const raw = await mockAsyncStorage.getItem(CACHE_KEY_LIST);
  if (!raw) return null;
  const payload = JSON.parse(raw);
  if (Date.now() - payload.cachedAt > CACHE_MAX_AGE_MS) return null;
  return payload.visitors;
}

async function setCachedVisitorsList(visitors) {
  const payload = { visitors, cachedAt: Date.now() };
  await mockAsyncStorage.setItem(CACHE_KEY_LIST, JSON.stringify(payload));
}

test('getCachedVisitorsList returns null when cache is empty', async () => {
  await mockAsyncStorage.clear();
  const res = await getCachedVisitorsList();
  assert.equal(res, null);
});

test('setCachedVisitorsList stores visitors and retrieves them validly', async () => {
  await mockAsyncStorage.clear();
  const sampleVisitors = [
    {
      id: 'v1',
      visitorName: 'Karim',
      visitorPhone: '+201012345678',
      isOpenQR: false,
      createdAt: new Date().toISOString(),
      qrCode: { id: 'qr1', code: 'qr-karim-pass', type: 'ONETIME' },
    },
  ];
  await setCachedVisitorsList(sampleVisitors);
  const cached = await getCachedVisitorsList();
  assert.notEqual(cached, null);
  assert.equal(cached.length, 1);
  assert.equal(cached[0].visitorName, 'Karim');
});

test('getCachedVisitorsList returns null when cache has expired', async () => {
  await mockAsyncStorage.clear();
  const expiredPayload = {
    visitors: [{ id: 'v2', visitorName: 'Old Guest' }],
    cachedAt: Date.now() - (CACHE_MAX_AGE_MS + 5000),
  };
  await mockAsyncStorage.setItem(
    CACHE_KEY_LIST,
    JSON.stringify(expiredPayload)
  );
  const cached = await getCachedVisitorsList();
  assert.equal(cached, null);
});
