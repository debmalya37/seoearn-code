// src/lib/payeer‑merchant.ts
import crypto from 'crypto';

const {
  PAYEER_MERCHANT_ID,
  PAYEER_MERCHANT_SECRET,
  PAYEER_SUCCESS_URL,
  PAYEER_API_USER,
  PAYEER_API_KEY,
  PAYEER_FAIL_URL,
  PAYEER_STATUS_URL,
} = process.env;

for (const v of [
  'PAYEER_MERCHANT_ID',
  'PAYEER_MERCHANT_SECRET',
  'PAYEER_SUCCESS_URL',
  'PAYEER_FAIL_URL',
  'PAYEER_STATUS_URL',
]) {
  if (!process.env[v as keyof typeof process.env]) {
    throw new Error(`[payeer-merchant] Missing env var ${v}`);
  }
}

export function buildPayeerForm(
  orderId: string,
  amount: number,
  currency: string,
  description?: string
): {
  url: string;
  fields: Record<string, string>;
} {
  const m_shop    = PAYEER_MERCHANT_ID!;
  const m_orderid = orderId;
  const m_amount  = amount.toFixed(2);
  const m_curr    = currency;
  const m_desc    = Buffer.from(description || `Deposit #${orderId}`).toString('base64');

  // signature: sha256 of these + secret
  const sign = crypto
    .createHash('sha256')
    .update([m_shop, m_orderid, m_amount, m_curr, m_desc, PAYEER_MERCHANT_SECRET].join(':'))
    .digest('hex')
    .toUpperCase();

  const fields: Record<string, string> = {
    m_shop,
    m_orderid,
    m_amount,
    m_curr,
    m_desc,
    m_sign: sign,
    // optionally you can add:
    // m_params, m_cipher_method, success_url, fail_url, status_url
    success_url: PAYEER_SUCCESS_URL!,
    fail_url:    PAYEER_FAIL_URL!,
    status_url:  PAYEER_STATUS_URL!,
  };

  return {
    url: 'https://payeer.com/merchant/',
    fields,
  };
}


export async function createPayout(opts: {
    orderId: string;   // your internal txn ID
    amount: number;    // major units
    curIn: string;     // e.g. 'USD' on your wallet
    curOut: string;    // e.g. 'USD'/'RUB' payout currency
    cntId: string;     // Payeer counterparty ID
    account: string;   // recipient account (U1234 / bank number)
    comment?: string;
  }): Promise<{ success: true; data: any } | { success: false; error: string }> {
    const { orderId, amount, curIn, curOut, cntId, account, comment } = opts;
    const user   = PAYEER_API_USER!;
    const key    = PAYEER_API_KEY!;
    const action = 'transfer';
    const sum    = amount.toFixed(2);
  
    // sign = HMAC‑SHA256( user:action:curIn:sum:curOut:cntId:account:key )
    const hmac = crypto
      .createHmac('sha256', key)
      .update([user, action, curIn, sum, curOut, cntId, account, key].join(':'))
      .digest('hex')
      .toUpperCase();
  
    const body = new URLSearchParams({
      user,
      action,
      curIn,
      sum,
      curOut,
      cntId,
      account,
      comment: comment || '',
      sign: hmac,
    });
  
    try {
      const res  = await fetch('https://payeer.com/api/cs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const json = (await res.json()) as { status: string; historyId?: string; errors?: string[] };
      if (json.status === 'success') {
        return { success: true, data: json };
      } else {
        return { success: false, error: json.errors?.[0] || 'Payeer payout failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  }