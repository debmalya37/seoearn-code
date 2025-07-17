// src/app/api/wallet/transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'userId is required' },
      { status: 400 }
    );
  }

  await dbConnect();
  const user = await UserModel.findById(userId).populate('transactions').exec();
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    );
  }

  // Sort by most recent first
  const sortedTxns = (user.transactions || []).sort(
    (a: any, b: any) => b.date.getTime() - a.date.getTime()
  );

  // Map to front-end shape
  const transactions = sortedTxns.map((t: any) => ({
    id:             t._id.toString(),
    type:           t.type,
    date:           t.date.toISOString(),
    status:         t.status,
    nativeAmount:   t.nativeAmount,
    nativeCurrency: t.nativeCurrency,
    usdAmount:      t.usdAmount,
  }));

  return NextResponse.json({ success: true, transactions });
}





















// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const userEmail = session.user.email;

//     const user = await UserModel.findOne({ email: userEmail }).populate('transactions').exec();
//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     const transactions = user.transactions?.sort((a:any, b:any) => b.date - a.date) || [];
//     console.log( "transactions : ", transactions);

//     return NextResponse.json({ success: true, transactions }, { status: 200 });
//   } catch (error) {
//     console.error('Fetch transactions error:', error);
//     return NextResponse.json({ success: false, message: 'Failed to fetch transactions' }, { status: 500 });
//   }
// }
