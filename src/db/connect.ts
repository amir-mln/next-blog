// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = { connectTimeoutMS: 10000 };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let database: Db;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function getDatabase() {
  if (!database) {
    const mongoClient = await clientPromise;
    database = mongoClient.db(process.env.MONGODB_NAME);
  }

  return database;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise, getDatabase };
