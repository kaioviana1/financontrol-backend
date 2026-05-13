import { z } from 'zod';

const idParam = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido.'),
});

const cardBody = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.').max(100),
  last_digits: z
    .string()
    .trim()
    .length(4, 'Informe os últimos 4 dígitos do cartão.')
    .regex(/^\d{4}$/, 'Últimos 4 dígitos devem ser numéricos.')
    .nullable()
    .optional(),
  brand: z
    .enum(['visa', 'mastercard', 'elo', 'amex', 'hipercard', 'outros'], {
      errorMap: () => ({ message: 'Bandeira inválida.' }),
    })
    .optional()
    .default('outros'),
  limit_amount: z.coerce
    .number({ invalid_type_error: 'Limite deve ser um número.' })
    .positive('Limite deve ser maior que zero.'),
  closing_day: z.coerce
    .number()
    .int()
    .min(1, 'Dia de fechamento deve ser entre 1 e 31.')
    .max(31, 'Dia de fechamento deve ser entre 1 e 31.'),
  due_day: z.coerce
    .number()
    .int()
    .min(1, 'Dia de vencimento deve ser entre 1 e 31.')
    .max(31, 'Dia de vencimento deve ser entre 1 e 31.'),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida. Use formato hex (#rrggbb).')
    .optional()
    .default('#6366f1'),
  is_active: z.boolean().optional().default(true),
});

export const createCardSchema = z.object({ body: cardBody });

export const updateCardSchema = z.object({ params: idParam, body: cardBody });

export const deleteCardSchema = z.object({ params: idParam });

export const cardInvoiceSchema = z.object({
  params: idParam,
  query: z.object({
    year:  z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1, 'Mês inválido.').max(12, 'Mês inválido.').optional(),
  }),
});
