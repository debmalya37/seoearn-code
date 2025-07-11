// src/lib/walletUtils.ts
import mongoose from 'mongoose';
import dbConnect from './dbConnect';
import Wallet from '@src/models/wallet';
import UserModel from '@src/models/userModel';

/**
 * Credit a user’s wallet and their User.balance/earnings/referralEarnings atomically.
 */
export async function addToWallet(
  userId: string,
  amount: number,
  type: 'earning' | 'referral' | 'adjustment',
  description: string
): Promise<{ walletBalance: number; userBalance: number }> {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Update or create Wallet doc
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true, session }
    );

    // 2) Update User doc
    const incFields: any = { balance: amount };
    if (type === 'earning')      incFields.earnings         = amount;
    if (type === 'referral')     incFields.referralEarnings = amount;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc: incFields,
        $push: {
          transactions: {
            type: 'deposit',
            amount,
            status: 'completed',
            date: new Date(),
            details: { description, source: type },
          },
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      walletBalance: wallet.balance,
      userBalance: user!.balance,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in addToWallet:', err);
    throw err;
  }
}

/**
 * Deduct funds from a user’s wallet and record a withdrawal transaction.
 */
export async function deductFromWallet(
  userId: string,
  amount: number,
  description: string
): Promise<{ walletBalance: number; userBalance: number }> {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Load wallet
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }
    wallet.balance -= amount;
    await wallet.save({ session });

    // 2) Update user
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc: { balance: -amount },
        $push: {
          transactions: {
            type: 'withdrawal',
            amount,
            status: 'completed',
            date: new Date(),
            details: { description },
          },
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      walletBalance: wallet.balance,
      userBalance: user!.balance,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error in deductFromWallet:', err);
    throw err;
  }
}

/**
 * Walks up to three levels of `referredBy` ancestors, paying out referral bonuses:
 *  Level 1: 10%, Level 2: 5%, Level 3: 2%
 */
export async function rewardReferralLevels(
  startingUserId: string,
  baseAmount: number
): Promise<void> {
  await dbConnect();
  // percentages for levels 1, 2, 3
  const LEVEL_RATES = [0.10, 0.05, 0.02];
  let currentUser = await UserModel.findById(startingUserId).exec();

  for (let level = 0; level < LEVEL_RATES.length; level++) {
    const refBy = currentUser?.referredBy;
    if (!refBy) break;

    // referredBy stores the userId string of the parent
    const referrer = await UserModel.findById(refBy).exec();
    if (!referrer) break;

    const bonus = parseFloat((baseAmount * LEVEL_RATES[level]).toFixed(2));
    if (bonus > 0) {
      await addToWallet(
        referrer._id.toString(),
        bonus,
        'referral',
        `Level ${level + 1} bonus from ${startingUserId}`
      );
    }

    // move up the chain
    currentUser = referrer;
  }
}
