const crypto = require('crypto');

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64url');
}

function sign(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function verify(token, secret) {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSig) {
    throw new Error('Invalid signature');
  }

  return {
    payload: JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()),
  };
}

function parseDuration(duration) {
  if (typeof duration === 'number') return duration;
  if (typeof duration !== 'string') return duration;

  const match = duration.match(/^(\d+)([smh])$/);
  if (!match) return duration;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    default:
      return duration;
  }
}

module.exports = {
  SignJWT: class {
    constructor(payload) {
      this._payload = payload;
      this._protectedHeader = {};
      this._subject = null;
      this._issuer = null;
      this._audience = null;
      this._issuedAt = null;
      this._expirationTime = null;
    }
    setProtectedHeader(header) {
      this._protectedHeader = header;
      return this;
    }
    setSubject(sub) {
      this._subject = sub;
      return this;
    }
    setIssuer(iss) {
      this._issuer = iss;
      return this;
    }
    setAudience(aud) {
      this._audience = aud;
      return this;
    }
    setIssuedAt() {
      this._issuedAt = Math.floor(Date.now() / 1000);
      return this;
    }
    setExpirationTime(time) {
      if (typeof time === 'string') {
        const seconds = parseDuration(time);
        if (typeof seconds === 'number') {
          this._expirationTime = Math.floor(Date.now() / 1000) + seconds;
        } else {
          this._expirationTime = time;
        }
      } else {
        this._expirationTime = time;
      }
      return this;
    }
    async sign(secret) {
      const secretKey =
        typeof secret === 'string'
          ? secret
          : new TextEncoder().encode(secret).toString();
      const payload = {
        ...this._payload,
        sub: this._subject,
        iss: this._issuer,
        aud: this._audience,
        iat: this._issuedAt,
        exp: this._expirationTime,
      };
      return sign(payload, secretKey);
    }
  },
  jwtVerify: async (token, secret, options) => {
    const secretKey =
      typeof secret === 'string'
        ? secret
        : new TextEncoder().encode(secret).toString();
    const result = await verify(token, secretKey);

    if (options) {
      if (options.issuer && result.payload.iss !== options.issuer) {
        throw new Error('Invalid issuer');
      }
      if (options.audience) {
        const aud = Array.isArray(options.audience)
          ? options.audience
          : [options.audience];
        if (!aud.includes(result.payload.aud)) {
          throw new Error('Invalid audience');
        }
      }
    }

    return result;
  },
  JWTPayload: {},
};
