import { Db } from 'mongodb';
import { nanoid } from 'nanoid';
import { Folder } from 'types/types';

export async function createFolder(db: Db, folder: Folder) {
  return await db.collection<Folder>('folders').insertOne({ _id: nanoid(), ...folder });
}

export async function getOneFolder(db: Db, folderId: string) {
  return await db.collection<Folder>('folders').findOne({ _id: folderId });
}

export async function getFolders(db: Db, userId: string) {
  return await db.collection<Folder>('folders').find({ createdBy: userId }).toArray();
}
