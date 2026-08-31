export interface BarrierTelemetry {
  gateId: string;
  gateName: string;
  status: 'OPEN' | 'CLOSED' | 'FAULT' | 'OFFLINE';
  lastHeartbeat: string;
  relayStatus: 'ACTIVE' | 'INACTIVE';
  temperatureCelsius?: number;
  voltageValue?: number;
  recentScansCount: number;
}

export class LiveBarrierMapState {
  private static barriersState: Map<string, BarrierTelemetry> = new Map();

  /**
   * Updates or initializes telemetry state for a gate.
   */
  static updateGateTelemetry(telemetry: BarrierTelemetry): void {
    this.barriersState.set(telemetry.gateId, {
      ...telemetry,
      lastHeartbeat: new Date().toISOString(),
    });
  }

  /**
   * Retrieves current live barrier telemetry for a specific gate.
   */
  static getGateTelemetry(gateId: string): BarrierTelemetry | null {
    return this.barriersState.get(gateId) || null;
  }

  /**
   * Returns all active gate telemetry states.
   */
  static getAllTelemetry(): BarrierTelemetry[] {
    return Array.from(this.barriersState.values());
  }

  /**
   * Clears in-memory telemetry state (useful for tests).
   */
  static clearState(): void {
    this.barriersState.clear();
  }
}
