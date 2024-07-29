import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import configs from '.';
import { ResultSetHeader, Pool, FieldPacket } from 'mysql2/promise';
import logger from '../configs/logger';

interface QueryResult<T = ResultSetHeader | FieldPacket[]> {
  rows: T;
  fields?: unknown;
}

const db = mysql.createPool({
  host: configs.DB_HOST,
  user: configs.DB_USER,
  password: configs.DB_PASS,
  database: configs.DB_NAME,
  port: +configs.DB_PORT!,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  Promise: bluebird,
});

export async function queryWithLogging<T>(
  pool: Pool,
  query: string,
  values?: unknown[]
): Promise<QueryResult<T>> {
  try {
    const startTime = Date.now();
    logger.sql(`Executing query: ${query}`);

    const [rows, fields] = await pool.execute(query, values);

    const elapsedTime = Date.now() - startTime;

    logger.info(`Query executed successfully in ${elapsedTime}ms`);

    return { rows, fields } as QueryResult<T>; // Type assertion to ensure compatibility
  } catch (error) {
    logger.error(`Error executing query: ${query}`, { error });
    throw error;
  }
}

export default db;
