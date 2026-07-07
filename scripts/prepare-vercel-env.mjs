import { writeFileSync } from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), '.env.production.local');
const env = [
  'NODE_ENV=production',
  'DATABASE_URL=${DATABASE_URL}',
  'ADMIN_USERNAME=${ADMIN_USERNAME}',
  'ADMIN_PASSWORD=${ADMIN_PASSWORD}',
  'ADMIN_SESSION_SECRET=${ADMIN_SESSION_SECRET}',
  'RESEND_API_KEY=${RESEND_API_KEY}',
  'EMAIL_FROM=${EMAIL_FROM}',
  'BLOB_READ_WRITE_TOKEN=${BLOB_READ_WRITE_TOKEN}'
].join('\n');

writeFileSync(target, env, 'utf8');
console.log(`Prepared ${target}`);
