import { z } from 'zod';

const transferRatioSchema = z.object({
  creditCardId: z.string().optional(),
  ratio: z
    .number()
    .min(0.1, 'Ratio must be at least 0.1')
    .max(5, 'Ratio must be at most 10')
    .default(1.0),
});

export const createProgramSchema = z.object({
  name: z
    .string()
    .min(1, 'Program name is required')
    .max(100, 'Program name must be less than 100 characters'),
  enabled: z.boolean().default(true),
  assetName: z.string().optional().default(''),
  transferRatios: z.array(transferRatioSchema).optional().default([]),
});

export const updateProgramSchema = createProgramSchema.partial().extend({
  enabled: z.boolean(),
  name: z
    .string()
    .min(1, 'Program name is required')
    .max(100, 'Program name must be less than 100 characters'),
});

export const programQuerySchema = z.object({
  page: z.coerce.number().min(0).optional().default(0),
  pageSize: z.coerce.number().min(1).max(100).optional().default(20),
});
