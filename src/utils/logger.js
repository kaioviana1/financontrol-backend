import winston from 'winston';
import { mkdirSync } from 'fs';

// Garante que o diretório de logs existe
try { mkdirSync('logs', { recursive: true }); } catch {}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logLine = printf(({ level, message, timestamp, stack }) =>
  `${timestamp} [${level.toUpperCase().padEnd(5)}] ${stack || message}`
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logLine
  ),
  transports: [
    // Somente erros
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024,  // 5 MB
      maxFiles: 5,
    }),
    // Todos os logs (info+)
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
  ],
  // Não lança exceção se um transport falhar
  exitOnError: false,
});

// Console sempre ativo (necessário para Render/cloud ver os logs)
logger.add(
  new winston.transports.Console({
    format: combine(
      process.env.NODE_ENV !== 'production' ? colorize({ all: true }) : winston.format.simple(),
      timestamp({ format: 'HH:mm:ss' }),
      logLine
    ),
  })
);

export default logger;
