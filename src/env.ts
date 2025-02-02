import * as dotenv from 'dotenv';
import * as path from 'path';

// Define the allowed database types
const DB_TYPES = ['mysql', 'mariadb', 'postgres', 'sqlite', 'cockroachdb', 'mssql'] as const;
export type DbType = typeof DB_TYPES[number];

// Function to validate and get database type
export function getValidDbType(): DbType {
  const dbType = process.env.DB_TYPE || 'mysql';
  if (!DB_TYPES.includes(dbType as DbType)) {
    throw new Error(`Invalid database type: ${dbType}. Allowed types are: ${DB_TYPES.join(', ')}`);
  }
  return dbType as DbType;
}

// Determine the environment
const nodeEnv = process.env.NODE_ENV || 'development';

// Load the appropriate .env file
const envFile = `.env.${nodeEnv}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const Env = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.PORT) || 8000,
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME,
  dbType: getValidDbType(),
  secretKey: process.env.SECRET_KEY,
  expiresIn: Number(process.env.EXPIRE_TIME) || 3600,
  nodeEnv,
};
