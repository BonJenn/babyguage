import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB',
  'OPENAI_API_KEY_2',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

console.log('Environment Variables Check:');
requiredEnvVars.forEach(varName => {
  const exists = process.env[varName] ? '✅' : '❌';
  console.log(`${varName}: ${exists}`);
});
