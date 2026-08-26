/**
 * State manager and QR payload generator for the Marketing Live Pass Simulator widget.
 */

export type PassAccessType = 'SINGLE_ENTRY' | 'MULTI_ENTRY' | 'VIP_ESCORT';

export interface PassSimulatorInput {
  visitorName: string;
  destinationUnit: string;
  gateZone: string;
  accessType: PassAccessType;
  validHours: number;
}

export interface SimulatedPassPayload {
  passId: string;
  visitorName: string;
  destinationUnit: string;
  gateZone: string;
  accessType: PassAccessType;
  expiresAt: string;
  isSimulatedDemo: true;
  scanUrl: string;
}

export const DEFAULT_PASS_INPUT: PassSimulatorInput = {
  visitorName: 'Karim Mansour',
  destinationUnit: 'Villa 402',
  gateZone: 'North Main Gate',
  accessType: 'SINGLE_ENTRY',
  validHours: 24,
};

/**
 * Validates pass simulator inputs.
 */
export function validatePassSimulatorInput(
  input: Partial<PassSimulatorInput>
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.visitorName || input.visitorName.trim().length < 2) {
    errors.visitorName = 'Visitor name must be at least 2 characters';
  }

  if (!input.destinationUnit || input.destinationUnit.trim().length === 0) {
    errors.destinationUnit = 'Destination unit is required';
  }

  if (!input.gateZone || input.gateZone.trim().length === 0) {
    errors.gateZone = 'Gate zone is required';
  }

  if (
    input.validHours !== undefined &&
    (input.validHours < 1 || input.validHours > 72)
  ) {
    errors.validHours = 'Valid hours must be between 1 and 72';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a mock signed pass payload for the interactive demo widget.
 */
export function generateSimulatedPass(
  input: PassSimulatorInput = DEFAULT_PASS_INPUT,
  baseTime: number = Date.now()
): SimulatedPassPayload {
  const passId = `demo_pass_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = new Date(
    baseTime + input.validHours * 3600 * 1000
  ).toISOString();
  const scanUrl = `https://gateflow.site/p/${passId}`;

  return {
    passId,
    visitorName: input.visitorName.trim(),
    destinationUnit: input.destinationUnit.trim(),
    gateZone: input.gateZone.trim(),
    accessType: input.accessType,
    expiresAt,
    isSimulatedDemo: true,
    scanUrl,
  };
}
