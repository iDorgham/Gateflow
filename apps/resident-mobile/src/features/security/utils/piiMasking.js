export function maskPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.trim();
  if (cleaned.length <= 6) return cleaned;

  const prefixLength = cleaned.startsWith('+') ? 5 : 3;
  const suffixLength = 4;

  const prefix = cleaned.slice(0, prefixLength);
  const suffix = cleaned.slice(-suffixLength);
  const maskedLength = Math.max(
    2,
    cleaned.length - prefixLength - suffixLength
  );

  return `${prefix}${'*'.repeat(maskedLength)}${suffix}`;
}

export function maskNationalId(id) {
  if (!id || typeof id !== 'string') return '';
  const trimmed = id.trim();
  if (trimmed.length <= 8) return '****' + trimmed.slice(-4);

  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  const maskedCount = trimmed.length - 8;

  return `${prefix}${'*'.repeat(maskedCount)}${suffix}`;
}

export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const parts = email.trim().split('@');
  if (parts.length !== 2) return email;

  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }

  const first = local[0];
  const last = local[local.length - 1];
  const masked = '*'.repeat(Math.min(5, local.length - 2));

  return `${first}${masked}${last}@${domain}`;
}

export function maskPlateNumber(plate) {
  if (!plate || typeof plate !== 'string') return '';
  const parts = plate.trim().split(' ');
  if (parts.length < 2) {
    return plate.slice(0, 1) + '***' + plate.slice(-2);
  }

  const [letters, numbers] = parts;
  const maskedLetters =
    letters.slice(0, 1) + '*'.repeat(Math.max(1, letters.length - 1));
  return `${maskedLetters} ${numbers}`;
}
