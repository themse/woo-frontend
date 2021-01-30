import { NextApiRequest, NextApiResponse } from 'next';

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  // eslint-disable-next-line no-param-reassign
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};
