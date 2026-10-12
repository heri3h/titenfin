import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'mbummm_titenfin',
      password: process.env.DB_PASSWORD || 'dcaa984179d4f94029517b03442b207f',
      database: process.env.DB_NAME || 'mbummm_titenfin',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}
