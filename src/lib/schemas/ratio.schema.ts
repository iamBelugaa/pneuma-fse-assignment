import { z } from 'zod';
import { idSchema } from '.';

const ratioSchema = z
  .number()
  .min(0.1, 'Transfer ratio must be at least 0.1 (meaning 10:1)')
  .max(5.0, 'Transfer ratio cannot exceed 5.0 (meaning 1:5)');

export const createTransferRatioSchema = z.object({
  ratio: ratioSchema,
  creditCardId: idSchema,
  programId: idSchema.optional(),
});

export const updateTransferRatioSchema = z
  .object({
    ratio: ratioSchema,
    creditCardId: idSchema,
    id: idSchema.optional(),
    programId: idSchema.optional(),
    archived: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided for update',
  });
