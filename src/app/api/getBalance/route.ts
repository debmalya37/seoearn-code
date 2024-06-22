import { NextApiRequest, NextApiResponse } from 'next';
import { getBalance } from '../../../lib/perfectMoney';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const balance = await getBalance();
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
}
