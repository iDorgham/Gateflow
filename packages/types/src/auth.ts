import { z } from 'zod';

export const LoginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number(),
  tokenType: z.literal('Bearer'),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export const RefreshTokenPayloadSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

export const RegisterPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationName: z.string().min(2).optional(),
});

export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(), // UserRole is a type, not an enum
  organizationId: z.string().nullable(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.string(), // UserRole is a type, not an enum
  organizationId: z.string().nullable(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
