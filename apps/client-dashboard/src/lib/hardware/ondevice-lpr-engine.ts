export interface LPROCRBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LPROCRResult {
  plateNumber: string;
  normalizedPlate: string;
  confidence: number; // 0.0 to 1.0
  inferenceTimeMs: number; // e.g. 14ms (~60 FPS)
  boundingBox: LPROCRBoundingBox;
  isOfflineRecognized: boolean;
}

export class OnDeviceLPREngine {
  /**
   * Simulates processing a camera video frame with TensorFlow Lite / CoreML model.
   * Runs local bounding box localization & character OCR at ~60 FPS (12-16ms latency).
   */
  static processFrame(params: {
    rawImageBuffer?: Buffer | ArrayBuffer;
    mockPlateText?: string;
    offlinePlateCache?: Set<string>;
  }): LPROCRResult {
    const startTime = Date.now();

    const rawText = params.mockPlateText || 'EGY - 8924';
    const normalized = rawText.replace(/[\s\-_.:,]/g, '').toUpperCase();

    // Check if plate exists in local offline SQLite/encrypted cache
    const isOfflineRecognized = params.offlinePlateCache
      ? params.offlinePlateCache.has(normalized)
      : false;

    const inferenceTimeMs = Math.max(12, Date.now() - startTime);

    return {
      plateNumber: rawText,
      normalizedPlate: normalized,
      confidence: 0.98,
      inferenceTimeMs,
      boundingBox: { x: 120, y: 340, width: 240, height: 80 },
      isOfflineRecognized,
    };
  }
}
