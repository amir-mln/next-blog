import type { NextApiRequest, NextApiResponse } from 'next';

export default function (req: NextApiRequest, res: NextApiResponse) {
  res.setPreviewData({});
  res.redirect(req.query.route as string);
}
