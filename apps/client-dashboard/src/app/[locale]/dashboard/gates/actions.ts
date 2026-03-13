'use server';

import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';

type Result = { success: boolean; error?: string };

export async function toggleGate(
  gateId: string,
  active: boolean
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      console.error('toggleGate: Unauthorized - No orgId in claims');
      return { success: false, error: 'Unauthorized.' };
    }

    const gate = await prisma.gate.findFirst({
      where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!gate) {
      console.error(`toggleGate: Gate not found or access denied: ${gateId}`);
      return { success: false, error: 'Gate not found.' };
    }

    await prisma.gate.update({
      where: { id: gateId },
      data: { isActive: active },
    });
    return { success: true };
  } catch (error) {
    console.error('toggleGate: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function createGate(
  orgId: string,
  name: string,
  location: string
): Promise<Result> {
  try {
    const claims = await getSessionClaims();

    if (!claims?.orgId || claims.orgId !== orgId) {
      console.error(
        `createGate: Unauthorized. Claims orgId: ${claims?.orgId}, requested orgId: ${orgId}`
      );
      return { success: false, error: 'Unauthorized.' };
    }

    if (!name.trim()) {
      return { success: false, error: 'Gate name is required.' };
    }

    const projectId = await getValidatedProjectId(orgId);

    await prisma.gate.create({
      data: {
        name: name.trim(),
        location: location.trim() || null,
        organizationId: orgId,
        ...(projectId ? { projectId } : {}),
        isActive: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('createGate: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateGate(
  gateId: string,
  name: string,
  location: string,
  options?: {
    latitude?: number | null;
    longitude?: number | null;
    locationRadiusMeters?: number | null;
    locationEnforced?: boolean | null;
    requiredIdentityLevel?: number | null;
  }
): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };
    if (!name.trim())
      return { success: false, error: 'Gate name is required.' };

    const gate = await prisma.gate.findFirst({
      where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!gate) return { success: false, error: 'Gate not found.' };

    const data = {
      name: name.trim(),
      location: location.trim() || null,
      ...(options?.latitude !== undefined && { latitude: options.latitude }),
      ...(options?.longitude !== undefined && { longitude: options.longitude }),
      ...(options?.locationRadiusMeters !== undefined && { locationRadiusMeters: options.locationRadiusMeters }),
      ...(options?.locationEnforced !== undefined && { locationEnforced: options.locationEnforced }),
      ...(options?.requiredIdentityLevel !== undefined && { requiredIdentityLevel: options.requiredIdentityLevel }),
    };

    await prisma.gate.update({
      where: { id: gateId },
      data,
    });
    return { success: true };
  } catch (error) {
    console.error('updateGate: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteGate(gateId: string): Promise<Result> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };

    const gate = await prisma.gate.findFirst({
      where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!gate) return { success: false, error: 'Gate not found.' };

    await prisma.gate.update({
      where: { id: gateId },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true };
  } catch (error) {
    console.error('deleteGate: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
