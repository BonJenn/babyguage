import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to environment variables');
}

const result = config({ path: resolve(process.cwd(), '.env.local') });
const uri = process.env.MONGODB_URI;
const options = {};
console.log('Environment loading result:', result);

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
