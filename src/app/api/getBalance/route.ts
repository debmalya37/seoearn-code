import { NextRequest, NextResponse } from 'next/server';
import { getBalance } from '@/lib/perfectMoney';

export async function GET(req: NextRequest) {
  try {
    const balance = await getBalance();
    return NextResponse.json(balance, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
