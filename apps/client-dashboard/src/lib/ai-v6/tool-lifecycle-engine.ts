export type ToolExecutionState =
  'requires-action' | 'executing' | 'completed' | 'rejected' | 'failed';

export const DANGEROUS_TOOL_NAMES = new Set([
  'issueGuestPass',
  'dispatchWorkOrder',
  'lockdownGate',
  'setEmergencyProtocol',
  'revokeResidentPass',
  'resetTenantCredentials',
  'triggerCompoundEmulation',
]);

export interface AgenticToolCall {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  state: ToolExecutionState;
  isDangerous: boolean;
  userConfirmed?: boolean;
  result?: any;
  error?: string;
  auditMetadata?: {
    actor: string;
    organizationId: string;
    timestamp: string;
  };
}

/**
 * Initializes a new AgenticToolCall from incoming AI tool invocation parameters.
 */
export function createAgenticToolCall(
  toolCallId: string,
  toolName: string,
  args: Record<string, any>
): AgenticToolCall {
  const isDangerous = DANGEROUS_TOOL_NAMES.has(toolName);

  return {
    toolCallId,
    toolName,
    args,
    state: isDangerous ? 'requires-action' : 'executing',
    isDangerous,
    userConfirmed: !isDangerous,
  };
}

/**
 * Approves a dangerous tool call that required explicit user action.
 */
export function approveToolCall(
  call: AgenticToolCall,
  actor: { id: string; organizationId: string }
): AgenticToolCall {
  if (call.state !== 'requires-action') {
    throw new Error(`Cannot approve tool call in state: ${call.state}`);
  }

  return {
    ...call,
    state: 'executing',
    userConfirmed: true,
    auditMetadata: {
      actor: actor.id,
      organizationId: actor.organizationId,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Rejects a tool call requiring user action.
 */
export function rejectToolCall(
  call: AgenticToolCall,
  reason: string = 'User rejected action'
): AgenticToolCall {
  if (call.state !== 'requires-action') {
    throw new Error(`Cannot reject tool call in state: ${call.state}`);
  }

  return {
    ...call,
    state: 'rejected',
    userConfirmed: false,
    error: reason,
  };
}

/**
 * Executes the tool with strict tenant organization scoping and error isolation.
 */
export async function executeToolCall(
  call: AgenticToolCall,
  executor: (args: Record<string, any>) => Promise<any> | any,
  actor: { id: string; organizationId: string }
): Promise<AgenticToolCall> {
  // Validate tenant isolation
  if (!actor.organizationId || actor.organizationId.trim().length === 0) {
    return {
      ...call,
      state: 'failed',
      error:
        'TENANT_SCOPE_MISSING: Tool execution requires an active organizationId.',
    };
  }

  // Ensure tool is in executing state
  if (call.state !== 'executing') {
    return {
      ...call,
      state: 'failed',
      error: `INVALID_STATE: Expected state 'executing', received '${call.state}'.`,
    };
  }

  try {
    const scopedArgs = {
      ...call.args,
      organizationId: actor.organizationId,
    };

    const result = await Promise.resolve(executor(scopedArgs));

    return {
      ...call,
      state: 'completed',
      result,
      auditMetadata: {
        actor: actor.id,
        organizationId: actor.organizationId,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    return {
      ...call,
      state: 'failed',
      error: err.message || 'Tool execution encountered an unexpected error',
    };
  }
}
