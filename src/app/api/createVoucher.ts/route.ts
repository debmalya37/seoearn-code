import { NextApiRequest, NextApiResponse } from 'next';
import { createVoucher } from '../../../lib/perfectMoney';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { amount } = req.body;

  try {
    const result = await createVoucher(amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create voucher' });
  }
}
