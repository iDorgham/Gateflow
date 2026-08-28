import { renderHook, waitFor } from '@testing-library/react';
import { useLiveShifts } from './use-live-shifts';

describe('useLiveShifts hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches live shifts telemetry successfully', async () => {
    const mockGates = [
      {
        gateId: 'gate_1',
        gateName: 'Main Entrance',
        location: 'North',
        latitude: 30.0,
        longitude: 31.0,
        isActive: true,
        projectId: 'proj_1',
        projectName: 'Compound A',
        status: 'ACTIVE',
        isTerminalConnected: true,
        lastHeartbeatAt: new Date().toISOString(),
        activeShift: {
          id: 'shift_1',
          guardId: 'guard_1',
          guardName: 'Ahmed',
          guardAvatar: null,
          startTime: new Date().toISOString(),
          elapsedMinutes: 45,
        },
        scheduledGuards: [],
        scansTodayCount: 15,
      },
    ];

    const mockSummary = {
      totalGates: 1,
      activeShiftsCount: 1,
      unmannedGatesCount: 0,
      overrunShiftsCount: 0,
      scheduledGatesCount: 0,
      activeGuardsCount: 1,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          gates: mockGates,
          summary: mockSummary,
        },
      }),
    } as Response);

    const { result } = renderHook(() => useLiveShifts('proj_1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.gates).toHaveLength(1);
    expect(result.current.gates[0].gateName).toBe('Main Entrance');
    expect(result.current.summary?.activeGuardsCount).toBe(1);
    expect(result.current.isError).toBe(false);
  });

  it('handles fetch failure gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLiveShifts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.gates).toEqual([]);
  });
});
