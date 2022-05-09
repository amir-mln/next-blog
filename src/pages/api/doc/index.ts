import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

import { doc, getDatabase } from 'db';
import { CustomJWT, Doc } from 'types/types';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const db = await getDatabase();
  const token = (await getToken({ req })) as CustomJWT;
  const newDoc = await doc.createDoc(db, { ...req.body, createdBy: token.id });
  const insertedDoc = await doc.getOneDoc(db, newDoc.insertedId);

  res.json(insertedDoc);
}
