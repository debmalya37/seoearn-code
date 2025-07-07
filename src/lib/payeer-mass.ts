import fetch from 'node-fetch';
// Removed import of URLSearchParams from 'url' as it conflicts with the global URLSearchParams

const {
  PAYEER_ACCOUNT,    // e.g. "P1000000"
  PAYEER_API_ID,     // numeric ID
  PAYEER_API_PASS,   // secret key
} = process.env;

for (const v of ['PAYEER_ACCOUNT','PAYEER_API_ID','PAYEER_API_PASS'] as const) {
  if (!process.env[v]) throw new Error(`Missing env var ${v}`);
}

type PayoutItem = {
  to: string;       // e.g. "P1001234"
  sumIn: string;    // amount as "12.34"
  curIn: string;    // "USD", "EUR", etc
  curOut: string;   // usually same as curIn
  comment?: string; // your internal txn ID etc
  referenceId?: string;
};

export async function massPayout(items: PayoutItem[]) {
  // build params
  const params = new URLSearchParams({
    account:  PAYEER_ACCOUNT!,
    apiId:    PAYEER_API_ID!,
    apiPass:  PAYEER_API_PASS!,
    action:   'massPayout',
    json:     '1',             // ask JSON back
  });

  // each item must be JSON‑encoded
  params.append('payoutList', JSON.stringify(items));

  const res = await fetch('https://payeer.com/ajax/api/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString() // Convert URLSearchParams to string for compatibility
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json() as {
    auth_error: string;
    errors: any[];
    success?: boolean;
    historyList?: Array<{ referenceId: string; historyId: string }>;
  };

  if (json.auth_error !== '0') {
    throw new Error('Payeer authorization failed: ' + (json.errors || []).join('; '));
  }
  if (!json.success) {
    throw new Error('Mass payout failed: ' + (json.errors || []).join('; '));
  }

  return json.historyList!;
}
