// src/lib/payeer.ts
import crypto from 'crypto'
import fetch from 'node-fetch'

const {
  PAYEER_MERCHANT_ID,
  PAYEER_MERCHANT_SECRET,
  PAYEER_API_USER,
  PAYEER_API_KEY,
  // PAYEER_SUCCESS_URL,
  // PAYEER_FAIL_URL,
  // PAYEER_STATUS_URL,
} = process.env

for (const v of [
  'PAYEER_MERCHANT_ID',
  'PAYEER_MERCHANT_SECRET',
  'PAYEER_API_USER',
  'PAYEER_API_KEY',
  // 'PAYEER_SUCCESS_URL',
  // 'PAYEER_FAIL_URL',
  // 'PAYEER_STATUS_URL',
]) {
  if (!process.env[v as keyof typeof process.env]) {
    throw new Error(`[payeer] Missing env var ${v}`)
  }
}

/**
 * 1) Generate a Payeer payment page URL
 */
export function createDepositUrl(opts: {
  orderId: string
  amount: number          // in major units, e.g. 12.34
  currency: string        // e.g. 'USD','EUR','RUB'
  description?: string
}) {
  const { orderId, amount, currency, description } = opts
  const m_shop    = PAYEER_MERCHANT_ID!
  const m_orderid = orderId
  const m_amount  = amount.toFixed(2)
  const m_curr    = currency
  const m_desc    = Buffer.from(description || `Deposit #${orderId}`).toString('base64')
  // md5(m_shop:m_orderid:m_amount:m_curr:m_desc:secret)
  const sign = crypto
    .createHash('md5')
    .update([m_shop, m_orderid, m_amount, m_curr, m_desc, PAYEER_MERCHANT_SECRET].join(':'))
    .digest('hex')

  const qs = new URLSearchParams({
    m_shop,
    m_orderid,
    m_amount,
    m_curr,
    m_desc,
    m_sign: sign,
  })

  return `https://payeer.com/merchant/?${qs}`
}

/**
 * 2) Verify an incoming IPN / status callback from Payeer
 */
export function verifyCallback(params: {
  m_operation_id: string
  m_operation_ps: string
  m_operation_date: string
  m_operation_pay_date: string
  m_shop: string
  m_orderid: string
  m_amount: string
  m_curr: string
  m_desc: string     // base64
  m_status: string
  m_sign: string
}) {
  const {
    m_orderid,
    m_amount,
    m_curr,
    m_desc,
    m_status,
    m_sign: incoming,
  } = params

  const sign = crypto
    .createHash('md5')
    .update([m_orderid, m_amount, m_curr, m_desc, m_status, PAYEER_MERCHANT_SECRET].join(':'))
    .digest('hex')
    .toUpperCase()

  return sign === incoming.toUpperCase()
}

/**
 * 3) Create a Payeer Payout (withdrawal) via the CS API
 */
export async function createPayout(opts: {
  orderId: string         // your internal ID
  amount: number           // major units
  curIn: string            // e.g. 'EUR'
  curOut: string           // e.g. 'USD' or 'RUB'
  cntId: string            // Payeer counterparty ID
  account: string          // recipient account, e.g. 'U1234567'
  comment?: string
}): Promise<{ success: true; data: any } | { success: false; error: string }> {
  const { orderId, amount, curIn, curOut, cntId, account, comment } = opts
  const user   = PAYEER_API_USER!
  const key    = PAYEER_API_KEY!
  const action = 'transfer'
  const sum    = amount.toFixed(2)

  // HMAC-SHA256(user:action:curIn:sum:curOut:cntId:account:key)
  const sign = crypto
    .createHmac('sha256', key)
    .update([user, action, curIn, sum, curOut, cntId, account, key].join(':'))
    .digest('hex')
    .toUpperCase()

  const body = new URLSearchParams({
    user,
    action,
    curIn,
    sum,
    curOut,
    cntId,
    account,
    comment: comment || '',
    sign,
  })

  const res = await fetch('https://payeer.com/api/cs/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const json = await res.json() as { status: string; historyId?: string; errors?: string[] }

  if (json.status === 'success') {
    return { success: true, data: json }
  } else {
    return { success: false, error: json.errors?.[0] || 'Payeer payout failed' }
  }
}
