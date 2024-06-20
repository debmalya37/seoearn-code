    import { NextRequest, NextResponse } from 'next/server';
    import { getSession } from 'next-auth/react';
    import dbConnect from '@/lib/dbConnect';
    import UserModel from '@/models/userModel';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession, User } from 'next-auth';

    export async function GET(req: NextRequest) {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;
      
        if (!session || !user) {
          return NextResponse.json(
            {
              success: false,
              message: "Not Authenticated",
            },
            { status: 401 }
          );
        }

    await dbConnect();

    try {
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ totalAmount: user.totalAmount || 0 });
    } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
    }
