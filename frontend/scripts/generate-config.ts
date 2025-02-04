import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.relative(process.cwd(), './.env');
const parsedEnv = dotenv.config({ path: envPath }).parsed || {};

const configDir = path.relative(process.cwd(), 'src/config');
fs.mkdirSync(configDir, { recursive: true });

const configPath = path.resolve(configDir, 'index.ts');
fs.writeFileSync(
  configPath, 
  `export const config = ${JSON.stringify(parsedEnv, null, 2)};
export default config;`
);

console.log('Configuration generated successfully');
