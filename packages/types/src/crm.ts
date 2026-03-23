/**
 * CRM shared Zod schemas and TypeScript types.
 * Used by both API route validation and client-side forms.
 */
import { z } from 'zod';

// ── Contact ──────────────────────────────────────────────────────────────────

export const CreateContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  phone: z.string().max(30).optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  companyWebsite: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  notes: z.string().max(2000).optional().nullable(),
  unitIds: z.array(z.string()).optional(),
  projectId: z.string().optional(),
});

export const UpdateContactSchema = CreateContactSchema.partial().omit({ projectId: true });

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;

export interface CrmContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  companyWebsite: string | null;
  notes: string | null;
  organizationId: string;
  createdAt: string | Date;
  deletedAt: string | Date | null;
  units: { id: string; name: string; projectId?: string | null }[];
}

// ── Unit ─────────────────────────────────────────────────────────────────────

export const CreateUnitSchema = z.object({
  name: z.string().min(1, 'Unit name is required').max(100),
  type: z.string().min(1, 'Unit type is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  building: z.string().max(100).optional().nullable(),
  sizeSqm: z.number().int().positive().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
});

export const UpdateUnitSchema = CreateUnitSchema.partial();

export type CreateUnitInput = z.infer<typeof CreateUnitSchema>;
export type UpdateUnitInput = z.infer<typeof UpdateUnitSchema>;

export interface CrmUnit {
  id: string;
  name: string;
  type: string;
  building: string | null;
  sizeSqm: number | null;
  projectId: string | null;
  organizationId: string;
  createdAt: string | Date;
  deletedAt: string | Date | null;
  project: { id: string; name: string } | null;
  contacts: { contact: { id: string; firstName: string; lastName: string } }[];
}

// ── Paginated response ────────────────────────────────────────────────────────

export interface CrmPaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
