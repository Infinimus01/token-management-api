import { z } from 'zod';

export const createTokenSchema = z.object({
  userId: z.string().min(1, 'userId must be a non-empty string'),
  scopes: z.array(z.string()).min(1, 'scopes must be a non-empty array'),
  expiresInMinutes: z.number().int().positive('expiresInMinutes must be a positive integer'),
});

export const listTokensSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;
export type ListTokensInput = z.infer<typeof listTokensSchema>;