import { NextApiRequest, NextApiResponse } from 'next';
import { transferFunds } from '../../../lib/perfectMoney';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { payerAccount, payeeAccount, amount, paymentId } = req.body;

  try {
    const result = await transferFunds(payerAccount, payeeAccount, amount, paymentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to transfer funds' });
  }
}
