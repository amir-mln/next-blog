import { Db } from 'mongodb';
import { nanoid } from 'nanoid';
import { Doc } from 'types/types';

export async function getOneDoc(db: Db, id: string) {
  return await db.collection<Doc>('docs').findOne({ _id: id });
}

export async function getDocsByFolder(db: Db, folderId: string) {
  return await db.collection<Doc>('docs').find({ folderId }).toArray();
}

export async function createDoc(db: Db, doc: Doc) {
  return await db.collection<Doc>('docs').insertOne({ ...doc, _id: nanoid() });
}

export async function updateOne(db: Db, id: string, updates: any) {
  return db.collection<Doc>('docs').updateOne({ _id: id }, { $set: updates });
}
