import { doc, getDatabase } from 'db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const db = await getDatabase();
  const docId = req.query.id as string;
  const updated = await doc.updateOne(db, docId, req.body);

  res.json({ acknowledged: updated.acknowledged });
}
