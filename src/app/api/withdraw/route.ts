import { NextRequest, NextResponse } from 'next/server';
import { withdrawMoney } from '@/app/utils/payment';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const result = await withdrawMoney(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
