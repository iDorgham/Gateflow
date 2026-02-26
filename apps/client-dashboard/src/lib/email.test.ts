import { describe, it, expect, mock, beforeEach } from 'bun:test';

// Define mocks
const mockSendMail = mock(() => Promise.resolve());
const mockCreateTransport = mock(() => ({
  sendMail: mockSendMail,
}));

// Mock nodemailer - this needs to happen before importing the module under test
mock.module('nodemailer', () => {
  return {
    createTransport: mockCreateTransport,
    default: {
        createTransport: mockCreateTransport
    }
  };
});

describe('getTransporter', () => {
  // Use let to store the imported module
  let emailModule: any;

  beforeEach(async () => {
    // Dynamic import to ensure mock is applied
    emailModule = await import('./email');
    emailModule.resetTransporter();
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    // Clear mock calls
    mockCreateTransport.mockClear();
  });

  it('should create a new transporter if one does not exist', () => {
    const transporter = emailModule.getTransporter();
    expect(transporter).toBeDefined();
    expect(mockCreateTransport).toHaveBeenCalledTimes(1);
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: { user: 'user', pass: 'pass' },
    });
  });

  it('should return the cached transporter if one exists', () => {
    const t1 = emailModule.getTransporter();
    const t2 = emailModule.getTransporter();
    expect(t1).toBe(t2);
    expect(mockCreateTransport).toHaveBeenCalledTimes(1);
  });

  it('should throw error if config is missing', () => {
    delete process.env.SMTP_HOST;
    expect(() => emailModule.getTransporter()).toThrow('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured');
  });
});

describe('buildEmailHtml', () => {
  let emailModule: any;
  beforeEach(async () => {
     emailModule = await import('./email');
  });

  it('should generate HTML with recipient name and org name', () => {
    const html = emailModule.buildEmailHtml('John Doe', 'Acme Corp');
    expect(html).toContain('Hi John Doe,');
    expect(html).toContain('Acme Corp');
  });

  it('should include expiry date if provided', () => {
    const date = new Date('2024-01-01');
    const html = emailModule.buildEmailHtml('John', 'Org', date);
    expect(html).toContain('Valid until: <strong>January 1, 2024</strong>');
  });

  it('should not include expiry date if not provided', () => {
    const html = emailModule.buildEmailHtml('John', 'Org');
    expect(html).not.toContain('Valid until:');
  });
});
