import { z } from 'zod';
import { idSchema } from '.';

export const fileUploadSchema = z.object({
  programId: idSchema,
  file: z.object({
    name: z.string(),
    size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
    type: z
      .string()
      .regex(
        /^image\/(jpeg|jpg|png|svg\+xml|webp)$/,
        'Only image files are allowed'
      ),
  }),
});
