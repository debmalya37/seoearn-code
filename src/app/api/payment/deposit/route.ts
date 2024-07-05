import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const { PM_MEMBER_ID, PM_PASSWORD, BUSINESS_ACCOUNT_ID } = process.env;

export async function POST(req: NextRequest) {
  const { userAccountId, amount, paymentId } = await req.json();

  if (!userAccountId || !amount || !paymentId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const url = `https://perfectmoney.com/acct/confirm.asp?AccountID=${PM_MEMBER_ID}&PassPhrase=${PM_PASSWORD}&Payer_Account=${userAccountId}&Payee_Account=${BUSINESS_ACCOUNT_ID}&Amount=${amount}&PAYMENT_ID=${paymentId}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.includes('ERROR')) {
      return NextResponse.json({ success: true, data }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Error processing payment', data }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}

export const runtime = "edge"

export default POST;
