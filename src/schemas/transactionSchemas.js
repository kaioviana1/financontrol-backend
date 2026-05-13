import { z } from 'zod';

const idParam = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido.'),
});

const transactionBody = z.object({
  category_id: z.number().int().positive().nullable().optional(),
  description: z.string().trim().min(1, 'Descrição é obrigatória.').max(200, 'Descrição pode ter no máximo 200 caracteres.'),
  amount: z.coerce
    .number({ invalid_type_error: 'Valor deve ser um número.' })
    .positive('Valor deve ser maior que zero.'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo deve ser "income" ou "expense".' }),
  }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD.'),
});

export const listTransactionsSchema = z.object({
  query: z.object({
    type: z.enum(['income', 'expense']).optional(),
    category_id: z.coerce.number().int().positive().optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const createTransactionSchema = z.object({ body: transactionBody });

export const updateTransactionSchema = z.object({ params: idParam, body: transactionBody });

export const deleteTransactionSchema = z.object({ params: idParam });
