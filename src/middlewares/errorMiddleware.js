import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Rota não encontrada: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Erros de validação Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos.',
      errors: err.errors.map((e) => ({
        field: e.path.slice(1).join('.') || e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Erros operacionais conhecidos (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Erros do MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Registro duplicado. Verifique os dados enviados.',
    });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referência inválida. O registro relacionado não existe.',
    });
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      success: false,
      message: 'Não é possível remover. Este registro está em uso.',
    });
  }

  // JWT fora do authMiddleware
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }

  // Erro inesperado — registra no log e não vaza detalhes em produção
  logger.error(err);
  return res.status(500).json({
    success: false,
    message: isDev ? err.message : 'Erro interno do servidor.',
    ...(isDev && { stack: err.stack }),
  });
};
