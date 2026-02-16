export const digestStringAsync = jest.fn((_algorithm: string, text: string) => 
  Promise.resolve(`hashed_${text}`)
);

export const getRandomBytesAsync = jest.fn((byteCount: number) => 
  Promise.resolve(new Uint8Array(byteCount))
);

export const CryptoDigestAlgorithm = {
  SHA256: 'SHA256',
  SHA384: 'SHA384',
  SHA512: 'SHA512',
};

export default { digestStringAsync, getRandomBytesAsync, CryptoDigestAlgorithm };
