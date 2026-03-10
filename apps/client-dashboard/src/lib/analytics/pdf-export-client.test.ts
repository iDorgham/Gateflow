/**
 * Unit test for client-side PDF download helper (no JSX).
 */
export {};

import { downloadAnalyticsPdf } from './pdf-export-client';

describe('downloadAnalyticsPdf', () => {
  const originalCreateObjectURL = (URL as unknown as { createObjectURL?: unknown })
    .createObjectURL;
  const originalRevokeObjectURL = (URL as unknown as { revokeObjectURL?: unknown })
    .revokeObjectURL;

  beforeEach(() => {
    (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn(async () => ({
      ok: true,
      blob: async () => new Blob(['%PDF-1.4 mock'], { type: 'application/pdf' }),
      text: async () => '',
    })) as unknown as jest.Mock;

    (URL as unknown as { createObjectURL: jest.Mock }).createObjectURL = jest.fn(
      () => 'blob:mock'
    );
    (URL as unknown as { revokeObjectURL: jest.Mock }).revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    (URL as unknown as { createObjectURL?: unknown }).createObjectURL =
      originalCreateObjectURL;
    (URL as unknown as { revokeObjectURL?: unknown }).revokeObjectURL =
      originalRevokeObjectURL;
    jest.resetAllMocks();
  });

  it('fetches export endpoint and triggers an anchor download', async () => {
    const clickSpy = jest.fn();
    const origCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const a = origCreateElement('a');
        (a as unknown as { click: () => void }).click = clickSpy;
        return a;
      }
      return origCreateElement(tagName);
    });

    await downloadAnalyticsPdf({
      locale: 'en',
      filters: {
        range: '7d',
        from: '2026-03-01',
        to: '2026-03-02',
        projectId: '',
        gateId: '',
        unitType: '',
        search: '',
        tagIds: '',
        mode: 'security',
      },
    });

    const fetchMock = (globalThis as unknown as { fetch: jest.Mock }).fetch;
    expect(fetchMock).toHaveBeenCalled();
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/analytics/export-pdf');
    expect(calledUrl).toContain('dateFrom=2026-03-01');
    expect(calledUrl).toContain('dateTo=2026-03-02');
    expect(calledUrl).toContain('locale=en');

    expect(clickSpy).toHaveBeenCalled();
    expect(
      (URL as unknown as { createObjectURL: jest.Mock }).createObjectURL
    ).toHaveBeenCalled();
    expect(
      (URL as unknown as { revokeObjectURL: jest.Mock }).revokeObjectURL
    ).toHaveBeenCalledWith('blob:mock');
  });
});

