// src/pages/api/deposit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const { PM_MEMBER_ID, PM_PASSWORD, BUSINESS_ACCOUNT_ID } = process.env;

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userAccountId, amount, paymentId } = req.body;

  if (!userAccountId || !amount || !paymentId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const url = `https://perfectmoney.com/acct/confirm.asp?AccountID=42850048&PassPhrase=#deb@perfect#24&Payer_Account=U46777206&Payee_Account=U46777206&Amount=1&PAYMENT_ID=U46777206`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.includes('ERROR')) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(500).json({ error: 'Error processing payment', data });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error });
  }
}

export default POST;
