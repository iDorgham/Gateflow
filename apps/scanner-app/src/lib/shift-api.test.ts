jest.mock('./auth-client', () => ({
  getValidAccessToken: jest.fn().mockResolvedValue('token'),
}));

import { endShiftOnServer } from './shift-api';
import { getValidAccessToken } from './auth-client';
import { fetchActiveShiftOnServer } from './shift-api';

describe('endShiftOnServer retry classification', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    (getValidAccessToken as jest.Mock).mockResolvedValue('token');
  });

  afterEach(() => jest.useRealTimers());

  it.each([400, 401, 403, 404, 422])(
    'does not retry permanent HTTP %s responses',
    async (status) => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status,
        json: jest.fn().mockResolvedValue({ message: 'Rejected' }),
      });

      await expect(endShiftOnServer('shift-1')).resolves.toMatchObject({
        ok: false,
        status,
        retryable: false,
      });
    }
  );

  it.each([408, 429, 500, 503])(
    'retries transient HTTP %s responses',
    async (status) => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status,
        json: jest.fn().mockResolvedValue({ message: 'Try later' }),
      });

      await expect(endShiftOnServer('shift-1')).resolves.toMatchObject({
        ok: false,
        status,
        retryable: true,
      });
    }
  );

  it('retries transport failures', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('offline'));

    await expect(endShiftOnServer('shift-1')).resolves.toMatchObject({
      ok: false,
      retryable: true,
    });
  });

  it('bounds token acquisition and classifies timeout as retryable', async () => {
    jest.useFakeTimers();
    (getValidAccessToken as jest.Mock).mockReturnValue(new Promise(() => {}));

    const result = endShiftOnServer('shift-1');
    await jest.advanceTimersByTimeAsync(15_000);

    await expect(result).resolves.toMatchObject({
      ok: false,
      retryable: true,
      authFailure: false,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('propagates authentication rejection from active-shift verification', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: 'Expired' }),
    });

    await expect(fetchActiveShiftOnServer('gate-1')).resolves.toMatchObject({
      ok: false,
      status: 401,
      retryable: false,
      authFailure: true,
    });
  });

  it('classifies a missing token as a hard authentication failure', async () => {
    (getValidAccessToken as jest.Mock).mockResolvedValue(null);

    await expect(endShiftOnServer('shift-1')).resolves.toMatchObject({
      ok: false,
      status: 401,
      retryable: false,
      authFailure: true,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
