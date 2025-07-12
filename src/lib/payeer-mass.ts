// src/lib/payeer-mass.ts
import fetch from 'node-fetch';

const {
  PAYEER_ACCOUNT,
  PAYEER_API_ID_MASS,
  PAYEER_API_PASS_MASS,
  PAYEER_PS_ID,
} = process.env;

for (const v of [
  'PAYEER_ACCOUNT',
  'PAYEER_API_ID_MASS',
  'PAYEER_API_PASS_MASS',
  'PAYEER_PS_ID',
] as const) {
  if (!process.env[v]) {
    throw new Error(`Missing Payeer env var ${v}`);
  }
}

export type PayoutItem = {
  to: string;
  sumIn: string;
  curIn: string;
  curOut: string;
  comment?: string;
  referenceId?: string;
};

interface PayeerMassResponse {
  auth_error: string;
  errors?: string[];
  success?: boolean;
  historyList?: Array<{ referenceId: string; historyId: string }>;
}

export async function massPayout(items: PayoutItem[]) {
  // build params
  const params = new URLSearchParams({
    account:  PAYEER_ACCOUNT!,
    apiId:    PAYEER_API_ID_MASS!,
    apiPass:  PAYEER_API_PASS_MASS!,
    action:   'massPayout',
    json:     '1',
  });

  const enriched = items.map(i => ({
    ps:                   PAYEER_PS_ID!,
    sumIn:                i.sumIn,
    curIn:                i.curIn,
    sumOut:               i.sumIn,
    curOut:               i.curOut,
    param_ACCOUNT_NUMBER: i.to,
    comment:              i.comment,
    referenceId:          i.referenceId,
  }));
  params.append('payoutList', JSON.stringify(enriched));

  const res = await fetch('https://payeer.com/ajax/api/api.php', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    params.toString(),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from Payeer`);
  }

  // 1) Tell TS to treat this as PayeerMassResponse
  const json = (await res.json()) as PayeerMassResponse;
  console.debug('Payeer massPayout response:', json);

  // 2) Check auth
  if (json.auth_error !== '0') {
    throw new Error('Payeer auth failed: ' + JSON.stringify(json.errors || json));
  }

  // 3) If we got historyList, return it
  if (Array.isArray(json.historyList) && json.historyList.length > 0) {
    return json.historyList;
  }

  // 4) Otherwise propagate whatever errors we got
  throw new Error('Mass payout failed: ' + JSON.stringify(json.errors ?? json));
}
