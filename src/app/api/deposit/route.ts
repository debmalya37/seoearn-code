import { NextRequest, NextResponse } from 'next/server';
import { depositMoney } from '@/app/utils/payment';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const result = await depositMoney(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
