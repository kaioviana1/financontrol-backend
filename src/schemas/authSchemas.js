import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.').max(100, 'Nome pode ter no máximo 100 caracteres.'),
    email: z.string().trim().email('E-mail inválido.'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('E-mail inválido.'),
    password: z.string().min(1, 'Senha é obrigatória.'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.').max(100),
    email: z.string().trim().email('E-mail inválido.'),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória.'),
    newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres.'),
  }),
});
