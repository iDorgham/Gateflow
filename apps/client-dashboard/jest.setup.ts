// @ts-nocheck
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.setImmediate =
  global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));

function createResponse(body, init) {
  const response = {
    status: (init && init.status) || 200,
    headers: new Map(Object.entries((init && init.headers) || {})),
    body: body,
    json: async function () {
      return typeof body === 'string' ? JSON.parse(body) : body;
    },
    text: async function () {
      return typeof body === 'string' ? body : JSON.stringify(body);
    },
  };
  Object.setPrototypeOf(response, MockNextResponse.prototype);
  return response;
}

const MockNextRequest = function (url, init) {
  this.url = url;
  this.method = (init && init.method) || 'GET';
  this.headers = new Map(Object.entries((init && init.headers) || {}));
  this.body = (init && init.body) || null;
};
MockNextRequest.prototype.json = function () {
  return JSON.parse(this.body || '{}');
};
MockNextRequest.prototype.clone = function () {
  return new MockNextRequest(this.url, {
    method: this.method,
    headers: Object.fromEntries(this.headers),
    body: this.body,
  });
};

const MockNextResponse = function (data, init) {
  this.status = (init && init.status) || 200;
  this.headers = new Map(Object.entries((init && init.headers) || {}));
  this.body = data;
};
MockNextResponse.prototype.json = async function () {
  return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
};
MockNextResponse.json = function (data, init) {
  return createResponse(data, init);
};
MockNextResponse.redirect = function (url, init) {
  return createResponse(null, {
    status: (init && init.status) || 307,
    headers: { Location: url },
  });
};

global.Request = function (url, init) {
  this.url = url;
  this.method = (init && init.method) || 'GET';
  this.headers = new Map(Object.entries((init && init.headers) || {}));
  this.body = init && init.body;
};

jest.mock('next/server', () => ({
  __esModule: true,
  NextRequest: MockNextRequest,
  NextResponse: MockNextResponse,
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  })),
  headers: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

global.jest = jest;

// Global @gate-access/db mock for generic build stability
jest.mock('@gate-access/db', () => ({
  prisma: {
    eventLog: {
      create: jest.fn().mockResolvedValue({ id: 'mock-id' }),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    webhook: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({ id: 'mock-audit-id' }),
    },
    organization: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    gate: {
      findMany: jest.fn(),
    },
    scanLog: {
      groupBy: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation((cb) => cb({
      eventLog: { create: jest.fn() },
      webhook: { findMany: jest.fn() },
    })),
  },
  Prisma: {
    sql: (s) => s,
    empty: '',
    raw: (s) => s,
    InputJsonObject: {} as any,
  },
  EventType: {
    QR_CREATED: 'QR_CREATED',
    QR_UPDATED: 'QR_UPDATED',
    QR_DELETED: 'QR_DELETED',
    SCAN_RECORDED: 'SCAN_RECORDED',
    CONTACT_CREATED: 'CONTACT_CREATED',
    CONTACT_UPDATED: 'CONTACT_UPDATED',
    VISITOR_QR_CREATED: 'VISITOR_QR_CREATED',
    VISITOR_QR_DELETED: 'VISITOR_QR_DELETED',
  },
  AccessRuleType: {
    ONETIME: 'ONETIME',
    DATERANGE: 'DATERANGE',
    RECURRING: 'RECURRING',
    PERMANENT: 'PERMANENT',
  },
}));
