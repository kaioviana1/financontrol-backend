import { z } from 'zod';

const idParam = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido.'),
});

const categoryBody = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.').max(100, 'Nome pode ter no máximo 100 caracteres.'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo deve ser "income" ou "expense".' }),
  }),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida. Use formato hex (#rrggbb).')
    .optional()
    .default('#6366f1'),
  icon: z.string().trim().max(50).optional().default('tag'),
});

export const createCategorySchema = z.object({ body: categoryBody });

export const updateCategorySchema = z.object({
  params: idParam,
  body: categoryBody,
});

export const deleteCategorySchema = z.object({ params: idParam });
