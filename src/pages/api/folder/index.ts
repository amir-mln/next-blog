import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

import { folder, getDatabase } from 'db';
import { CustomJWT } from 'types/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDatabase();
  const token = (await getToken({ req })) as CustomJWT;
  const newFolder = await folder.createFolder(db, { ...req.body, createdBy: token.id });
  const insertedFolder = await folder.getOneFolder(db, newFolder.insertedId);

  res.json(insertedFolder);
};
