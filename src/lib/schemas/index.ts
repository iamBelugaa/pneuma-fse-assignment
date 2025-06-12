import { z } from 'zod';
import {
  createProgramSchema,
  programQuerySchema,
  updateProgramSchema,
} from './program.schema';
import {
  createTransferRatioSchema,
  updateTransferRatioSchema,
} from './ratio.schema';
import { fileUploadSchema } from './upload.schema';
import { signinSchema, signupSchema } from './user.schema';

export const idSchema = z.string().uuid().min(1, 'ID is required');

export type CreateUserInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof signinSchema>;

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

export type CreateTransferRatioInput = z.infer<
  typeof createTransferRatioSchema
>;
export type UpdateTransferRatioInput = z.infer<
  typeof updateTransferRatioSchema
>;

export type ProgramQueryInput = z.infer<typeof programQuerySchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
