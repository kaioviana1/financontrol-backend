import 'dotenv/config';
import app from './src/app.js';
import { testConnection } from './src/config/db.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 3000;

await testConnection();

const server = app.listen(PORT, () => {
  logger.info(`Servidor iniciado em http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// ── Graceful shutdown ─────────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} recebido. Encerrando servidor...`);
  server.close(() => {
    logger.info('Servidor encerrado com sucesso.');
    process.exit(0);
  });
  // Força encerramento após 10s se conexões não fecharem
  setTimeout(() => {
    logger.error('Encerramento forçado após timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('Exceção não capturada:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Promise rejeitada sem tratamento:', reason);
  process.exit(1);
});
