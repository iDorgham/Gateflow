/**
 * Lead qualification validation and CRM payload dispatcher for GateFlow marketing.
 */

export type PropertyType = 'COMPOUND' | 'COMMERCIAL' | 'EVENT' | 'OTHER';

export interface LeadSubmissionInput {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  propertyType: PropertyType;
  gateCount: number;
  primaryGoal: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

export interface ValidatedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  propertyType: PropertyType;
  gateCount: number;
  primaryGoal: string;
  attribution: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    referrer: string;
  };
  createdAt: string;
}

/**
 * Validates inbound lead inputs.
 */
export function validateLeadSubmission(input: Partial<LeadSubmissionInput>): {
  isValid: boolean;
  errors: Record<string, string>;
  data?: ValidatedLead;
} {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Full name is required (minimum 2 characters)';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'A valid work email is required';
  }

  if (!input.phone || input.phone.trim().length < 7) {
    errors.phone = 'A valid phone number is required';
  }

  if (!input.propertyType) {
    errors.propertyType = 'Property type is required';
  }

  if (input.gateCount === undefined || input.gateCount < 1) {
    errors.gateCount = 'Gate count must be at least 1';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  const validated: ValidatedLead = {
    id: `lead_${Math.random().toString(36).substring(2, 10)}`,
    name: input.name!.trim(),
    email: input.email!.trim().toLowerCase(),
    phone: input.phone!.trim(),
    companyName: input.companyName?.trim() || 'Undisclosed',
    propertyType: input.propertyType!,
    gateCount: Number(input.gateCount),
    primaryGoal: input.primaryGoal?.trim() || 'Fast Queue Clearance',
    attribution: {
      utmSource: input.utmSource || 'direct',
      utmMedium: input.utmMedium || 'organic',
      utmCampaign: input.utmCampaign || 'none',
      referrer: input.referrer || 'direct',
    },
    createdAt: new Date().toISOString(),
  };

  return { isValid: true, errors: {}, data: validated };
}

/**
 * Formats lead data for external CRM / Slack webhook ingestion.
 */
export function formatCrmWebhookPayload(lead: ValidatedLead): {
  channel: string;
  leadId: string;
  summary: string;
  fields: { label: string; value: string }[];
} {
  return {
    channel: '#sales-inbound-leads',
    leadId: lead.id,
    summary: `New Inbound B2B Lead: ${lead.name} (${lead.companyName}) - ${lead.propertyType} (${lead.gateCount} Gates)`,
    fields: [
      { label: 'Name', value: lead.name },
      { label: 'Email', value: lead.email },
      { label: 'Phone', value: lead.phone },
      { label: 'Company', value: lead.companyName },
      { label: 'Property Type', value: lead.propertyType },
      { label: 'Gate Count', value: String(lead.gateCount) },
      { label: 'Goal', value: lead.primaryGoal },
      { label: 'Campaign Source', value: lead.attribution.utmSource },
    ],
  };
}
