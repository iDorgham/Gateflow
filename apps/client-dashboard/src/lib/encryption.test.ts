import {
  encryptField,
  decryptField,
  isEncryptedField,
  generateSecret,
  ENCRYPTED_PREFIX,
} from './encryption';

describe('encryption.ts', () => {
  const PLAIN_TEXT = 'Hello, World! 🌍';

  describe('encryptField', () => {
    it('should encrypt data and include the version prefix', () => {
      const encrypted = encryptField(PLAIN_TEXT);
      expect(encrypted.startsWith(ENCRYPTED_PREFIX)).toBe(true);
      expect(encrypted).not.toBe(PLAIN_TEXT);
    });

    it('should be non-deterministic (different IVs for same plaintext)', () => {
      const enc1 = encryptField(PLAIN_TEXT);
      const enc2 = encryptField(PLAIN_TEXT);
      expect(enc1).not.toBe(enc2);
    });
  });

  describe('decryptField', () => {
    it('should decrypt data encrypted with encryptField', () => {
      const encrypted = encryptField(PLAIN_TEXT);
      const decrypted = decryptField(encrypted);
      expect(decrypted).toBe(PLAIN_TEXT);
    });

    it('should decrypt legacy data (missing prefix)', () => {
      // Simulate legacy data by stripping the prefix from a valid encrypted string
      const encrypted = encryptField(PLAIN_TEXT);
      const legacyFormat = encrypted.slice(ENCRYPTED_PREFIX.length);

      expect(legacyFormat.startsWith(ENCRYPTED_PREFIX)).toBe(false);
      const decrypted = decryptField(legacyFormat);
      expect(decrypted).toBe(PLAIN_TEXT);
    });

    it('should throw error for data too short to contain IV and Tag', () => {
      const shortData = Buffer.alloc(10).toString('base64');
      expect(() => decryptField(shortData)).toThrow(
        '[encryption] Decryption failed — data too short'
      );
    });

    it('should throw error for corrupted data (auth tag mismatch)', () => {
      const encrypted = encryptField(PLAIN_TEXT);
      // Decode, flip a bit in the ciphertext (last byte), re-encode
      const b64 = encrypted.slice(ENCRYPTED_PREFIX.length);
      const data = Buffer.from(b64, 'base64');

      // Data layout: IV (12) | Tag (16) | Ciphertext (N)
      // Modify the last byte (part of ciphertext)
      data[data.length - 1] ^= 1;

      const corrupted = ENCRYPTED_PREFIX + data.toString('base64');
      expect(() => decryptField(corrupted)).toThrow(
        '[encryption] Decryption failed — wrong key or corrupted data'
      );
    });

    it('should throw error for corrupted tag', () => {
        const encrypted = encryptField(PLAIN_TEXT);
        const b64 = encrypted.slice(ENCRYPTED_PREFIX.length);
        const data = Buffer.from(b64, 'base64');

        // Modify a byte in the tag (index 12 to 27)
        data[15] ^= 1;

        const corrupted = ENCRYPTED_PREFIX + data.toString('base64');
         expect(() => decryptField(corrupted)).toThrow(
          '[encryption] Decryption failed — wrong key or corrupted data'
        );
    });
  });

  describe('isEncryptedField', () => {
    it('should return true for strings starting with the prefix', () => {
      expect(isEncryptedField(ENCRYPTED_PREFIX + 'somebase64')).toBe(true);
    });

    it('should return false for strings without the prefix', () => {
      expect(isEncryptedField('somebase64')).toBe(false);
      expect(isEncryptedField('plain text')).toBe(false);
    });
  });

  describe('generateSecret', () => {
    it('should generate a 32-byte hex string (64 chars)', () => {
      const secret = generateSecret();
      expect(secret).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should return unique secrets', () => {
      const s1 = generateSecret();
      const s2 = generateSecret();
      expect(s1).not.toBe(s2);
    });
  });
});
