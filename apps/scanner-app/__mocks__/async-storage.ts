const store: Record<string, string> = {};

export const getItem = jest.fn((key: string) => Promise.resolve(store[key] ?? null));
export const setItem = jest.fn((key: string, value: string) => {
  store[key] = value;
  return Promise.resolve();
});
export const removeItem = jest.fn((key: string) => {
  delete store[key];
  return Promise.resolve();
});
export const clear = jest.fn(() => {
  Object.keys(store).forEach((key) => delete store[key]);
  return Promise.resolve();
});

export default { getItem, setItem, removeItem, clear };
