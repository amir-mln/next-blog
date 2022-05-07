import { NextApiRequest, NextApiResponse } from 'next';

export default function (req: NextApiRequest, res: NextApiResponse) {
  res.clearPreviewData();
  res.json({ preview: false });
}
