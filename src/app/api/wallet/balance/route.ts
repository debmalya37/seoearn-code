// src/app/api/wallet/balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';
import Wallet from '@src/models/wallet';


export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
  }

  await dbConnect();
  
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    return NextResponse.json({ success: false, message: 'Wallet not found', balance: 0 }, { status: 404 });
  }

  return NextResponse.json({ success: true, balance: wallet.balance });
}




// export async function GET(request: NextRequest) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user || !session.user.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const user = await UserModel.findOne({ email: session.user.email });
//   if (!user) {
//     return NextResponse.json({ error: 'User not found' }, { status: 404 });
//   }

//   return NextResponse.json({ balance: user.balance });
// }