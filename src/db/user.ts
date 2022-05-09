import { Db } from 'mongodb';

export async function getUserById(db: Db, id: string) {
  return await db.collection('users').findOne({ _id: id });
}
