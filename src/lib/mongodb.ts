import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables with explicit path
const result = config({ path: resolve(process.cwd(), '.env.local') });

// Debug logging
console.log('Environment loading result:', result);
console.log('Current working directory:', process.cwd());
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
console.log('MongoDB DB:', process.env.MONGODB_DB ? 'Found' : 'Not found');

// Ensure environment variables are loaded
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  console.error('Environment variables:', process.env);
  throw new Error('MongoDB URI not found in environment variables');
}

if (!dbName) {
  throw new Error('MongoDB database name not found in environment variables');
}

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
