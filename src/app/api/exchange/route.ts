import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const amount = searchParams.get('amount');

  if (!from || !to || !amount) {
    return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const apiRes = await fetch(url);
    const data = await apiRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Conversion failed' }, { status: 500 });
  }
}
