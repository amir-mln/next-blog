import { clientPromise, getDatabase } from 'db/connect';

declare global {
  namespace NodeJS {
    interface Global {
      mongo: any;
    }
  }
}

export default async function database(req, res, next) {
  req.db = await getDatabase();
  req.mongoClient = await clientPromise;

  next();
}
