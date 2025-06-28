// src/app/api/payUser/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';
import crypto from 'crypto';

interface PayeerRequestBody {
  userId: string;
  amount: number;
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { userId, amount }: PayeerRequestBody = await request.json();

    if (!userId || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    // 1. Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    if (user.isBlocked) {
      return NextResponse.json({ success: false, message: 'Cannot pay a blocked user' }, { status: 403 });
    }

    // 2. Prepare Payeer parameters
    const MERCHANT_ID = process.env.PAYEER_MERCHANT_ID!;
    const API_KEY = process.env.PAYEER_API_KEY!;
    const API_URL = process.env.PAYEER_API_URL || 'https://payeer.com/api/merchant';

    // Unique order ID for your system
    const orderId = `payuser_${userId}_${Date.now()}`;

    // Payeer requires a sign: md5(MERCHANT_ID:amount:currency:orderId:API_KEY)
    const currency = 'USD'; // or your currency code
    const signString = `${MERCHANT_ID}:${amount.toFixed(2)}:${currency}:${orderId}:${API_KEY}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex').toUpperCase();

    // 3. Construct payload for Payeer “create payment” endpoint
    const payeerPayload = {
      method: 'CreatePayment',
      merchant: MERCHANT_ID,
      amount: amount.toFixed(2),
      currency,
      order_id: orderId,
      sign,
      // Optional fields (you can set a user’s email or phone, or a comment)
      // You may also pass a user_comment or user_email if Payeer account is set up for that
      user_email: user.email,
    };

    // 4. Send request to Payeer
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payeerPayload),
    });
    const data = await res.json();

    if (!data || data.status !== 'success' || !data.data?.url) {
      console.error('Payeer returned an error:', data);
      return NextResponse.json({ success: false, message: 'Payeer API error', detail: data }, { status: 502 });
    }

    const paymentUrl: string = data.data.url; // The URL to which user (or you) redirect to confirm payment

    // 5. Insert a new “pending” transaction in the user’s document
    user.transactions = user.transactions || [];
    user.transactions.push({
      type: 'withdrawal',
      amount,
      date: new Date(),
      status: 'pending',
      // default values: Mongoose sub‐schema will automatically fill `createdAt` if needed
    } as any);

    // Optionally: decrease `balance`, etc., but a safer approach is to wait for actual Payeer callback IPN
    await user.save();

    // 6. Return the URL (or simply return success + transaction id)
    return NextResponse.json({
      success: true,
      message: 'Payment request created',
      paymentUrl,
      orderId,
    });
  } catch (error) {
    console.error('Error in payUser:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
