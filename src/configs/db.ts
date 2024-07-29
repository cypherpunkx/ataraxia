import mysql, { PoolConnection, ErrorPacketParams } from 'mysql2/promise';
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
  pool: Pool | PoolConnection,
  query: string,
  values?: unknown[],
  context?: string,
  metadata?: Record<string, any>
): Promise<QueryResult<T>> {
  try {
    const startTime = Date.now();
    logger.sql(`Executing query: ${query}`);

    const [rows, fields] = await pool.execute(query, values);

    const elapsedTime = Date.now() - startTime;

    logger.info(`Query executed successfully in ${elapsedTime}ms`, {
      context,
      ...metadata,
    });

    return { rows, fields } as QueryResult<T>; // Type assertion to ensure compatibility
  } catch (error) {
    logger.error(`Error executing query: ${query}`, {
      error,
      context,
      ...metadata,
    });

    if ((error as ErrorPacketParams).code === 'ER_LOCK_DEADLOCK') {
      logger.warn('Deadlock detected while executing query', {
        context,
        ...metadata,
      });
    } else if ((error as ErrorPacketParams).code === 'ER_DUP_ENTRY') {
      logger.error('Duplicate entry error while executing query', {
        context,
        error,
        ...metadata,
      });
    } else if (error instanceof SyntaxError) {
      logger.error('Syntax error in SQL query', {
        context,
        error,
        ...metadata,
      });
    } else {
      logger.error('Unexpected error occurred while executing query', {
        context,
        error,
        ...metadata,
      });
    }

    throw error;
  }
}

export async function transactionWithLogging<T>(
  pool: Pool,
  callback: (connection: PoolConnection) => Promise<T>,
  context?: string,
  maxRetries: number = 3,
  retryInterval: number = 1000, // in milliseconds
  metadata?: Record<string, any>
): Promise<T> {
  let retries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      logger.info('Transaction started', { context, ...metadata });

      const result = await callback(connection);

      await connection.commit();
      logger.info('Transaction committed', { context, ...metadata });

      return result;
    } catch (error) {
      if (connection) {
        await connection.rollback();
        logger.error('Transaction rolled back', {
          error,
          context,
          ...metadata,
        });
      } else {
        logger.error('Error occurred outside of transaction', {
          error,
          context,
          ...metadata,
        });
      }

      if (
        (error as ErrorPacketParams).code === 'ER_LOCK_DEADLOCK' &&
        retries < maxRetries
      ) {
        retries++;
        logger.warn(
          `Deadlock detected, retrying transaction (${retries}/${maxRetries})`,
          { context, ...metadata }
        );
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      } else if ((error as ErrorPacketParams).code === 'ER_DUP_ENTRY') {
        logger.error('Duplicate entry error', { context, error, ...metadata });
        throw error;
      } else if (error instanceof SyntaxError) {
        logger.error('Syntax error in SQL query', {
          context,
          error,
          ...metadata,
        });
        throw error;
      } else {
        logger.error('Unexpected error occurred', {
          context,
          error,
          ...metadata,
        });
        throw error;
      }

      if (retries >= maxRetries) {
        logger.error('Max retries reached, transaction failed', {
          context,
          error,
          ...metadata,
        });
        throw error;
      }
    } finally {
      connection.release();
      logger.info('Connection released', { context, ...metadata });
    }
  }
}
export default db;
