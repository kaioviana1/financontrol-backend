import { z } from 'zod';

const idParam = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido.'),
});

const goalBody = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório.').max(150, 'Título pode ter no máximo 150 caracteres.'),
  target_amount: z.coerce
    .number({ invalid_type_error: 'Valor alvo deve ser um número.' })
    .positive('Valor alvo deve ser maior que zero.'),
  current_amount: z.coerce.number().min(0, 'Valor atual não pode ser negativo.').optional().default(0),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD.')
    .nullable()
    .optional(),
});

export const createGoalSchema = z.object({ body: goalBody });

export const updateGoalSchema = z.object({ params: idParam, body: goalBody });

export const deleteGoalSchema = z.object({ params: idParam });
