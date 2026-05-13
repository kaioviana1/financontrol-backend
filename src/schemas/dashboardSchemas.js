import { z } from 'zod';

export const getDashboardSchema = z.object({
  query: z.object({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce
      .number()
      .int()
      .min(1, 'Mês inválido. Use um valor entre 1 e 12.')
      .max(12, 'Mês inválido. Use um valor entre 1 e 12.')
      .optional(),
  }),
});
