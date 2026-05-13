import { z } from 'zod';

const idParam = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido.'),
});

const installmentBody = z.object({
  card_id: z.coerce.number().int().positive('Cartão é obrigatório.'),
  description: z.string().trim().min(1, 'Descrição é obrigatória.').max(200),
  total_amount: z.coerce
    .number({ invalid_type_error: 'Valor total deve ser um número.' })
    .positive('Valor total deve ser maior que zero.'),
  installment_count: z.coerce
    .number()
    .int()
    .min(2, 'Mínimo de 2 parcelas.')
    .max(48, 'Máximo de 48 parcelas.'),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD.'),
});

// Na atualização card_id não pode ser alterado
const installmentUpdateBody = installmentBody.omit({ card_id: true });

export const listInstallmentsSchema = z.object({
  query: z.object({
    card_id: z.coerce.number().int().positive().optional(),
    active:  z.enum(['true', 'false']).optional(),
  }),
});

export const createInstallmentSchema = z.object({ body: installmentBody });

export const updateInstallmentSchema = z.object({ params: idParam, body: installmentUpdateBody });

export const deleteInstallmentSchema = z.object({ params: idParam });

export const payInstallmentSchema = z.object({ params: idParam });
