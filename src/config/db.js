import mysql from 'mysql2/promise';
import logger from '../utils/logger.js';

const pool = mysql.createPool({
  host:             process.env.DB_HOST,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASSWORD,
  database:         process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:  Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit:       0,
  timezone:         'local',
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info(`Banco de dados conectado: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    connection.release();
  } catch (error) {
    logger.error(`Falha ao conectar ao banco de dados: ${error.message}`);
    process.exit(1);
  }
};

export default pool;
