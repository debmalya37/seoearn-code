// src/lib/payeer-single.ts
import fetch from 'node-fetch';

const {
  PAYEER_ACCOUNT,
  PAYEER_API_ID_MASS,
  PAYEER_API_PASS_MASS,
  PAYEER_PS_ID
} = process.env;

for (const v of ['PAYEER_ACCOUNT','PAYEER_API_ID_MASS','PAYEER_API_PASS_MASS','PAYEER_PS_ID'] as const) {
  if (!process.env[v]) throw new Error(`Missing Payeer env var ${v}`);
}

export async function singlePayout(to: string, sumIn: string, cur: string, referenceId: string) {
    const uniqueRef = `${referenceId}-${Date.now()}`;
  
    const params = new URLSearchParams({
      account: PAYEER_ACCOUNT!,
      apiId:   PAYEER_API_ID_MASS!,
      apiPass: PAYEER_API_PASS_MASS!,
      action:  'payout',
      ps:      PAYEER_PS_ID!,
      sumIn,
      curIn:   cur,
      sumOut:  sumIn,
      curOut:  cur,
      param_ACCOUNT_NUMBER: to,
      referenceId: uniqueRef,
      json:    '1',
    });
  
    const res = await fetch('https://payeer.com/ajax/api/api.php', {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
    const j = await res.json() as any;
    console.log('Payeer singlePayout raw response:', j);
  
    if (j.auth_error !== '0') throw new Error('Auth failed: ' + JSON.stringify(j.errors || j));
  
    if (!j.historyId) throw new Error('Payout failed: ' + JSON.stringify(j.errors ?? j));
    return j.historyId;
  }
  
