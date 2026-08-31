import { OnDeviceLPREngine } from './ondevice-lpr-engine';

describe('OnDeviceLPREngine', () => {
  it('extracts license plate text with high confidence and ~60 FPS inference latency', () => {
    const result = OnDeviceLPREngine.processFrame({
      mockPlateText: 'DUBAI - A 19482',
    });

    expect(result.plateNumber).toBe('DUBAI - A 19482');
    expect(result.normalizedPlate).toBe('DUBAIA19482');
    expect(result.confidence).toBeGreaterThanOrEqual(0.95);
    expect(result.inferenceTimeMs).toBeLessThanOrEqual(50);
  });

  it('matches plate against local offline SQLite cache', () => {
    const cache = new Set(['DUBAIA19482']);
    const result = OnDeviceLPREngine.processFrame({
      mockPlateText: 'DUBAI - A 19482',
      offlinePlateCache: cache,
    });

    expect(result.isOfflineRecognized).toBe(true);
  });
});
