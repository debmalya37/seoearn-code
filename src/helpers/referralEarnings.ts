// src/helpers/referralEarnings.ts
import UserModel from '@src/models/userModel';
import { Types } from 'mongoose';

const LEVEL_ONE_PERCENTAGE = 0.10;  // 10%
const LEVEL_TWO_PERCENTAGE = 0.05;  // 5%

/**
 * Whenever `currentUserId` earns `amountEarned` (e.g. from completing a task),
 * call this function to pay out referral commissions:
 *   – 10% goes to the immediate referrer (if any),
 *   –  5% goes to the referrer’s referrer (if any).
 *
 * Also increments each referrer’s `referralEarnings` field accordingly.
 */
export const handleReferralEarnings = async (
  currentUserId: Types.ObjectId,
  amountEarned: number
) => {
  // 1. Find the user who just earned money:
  const currentUser = await UserModel.findById(currentUserId).exec();
  if (!currentUser) return;

  // 2. Level-1: the direct referrer (if any)
  if (currentUser.referredBy) {
    const levelOneUser = await UserModel.findById(currentUser.referredBy).exec();
    if (levelOneUser) {
      const levelOneCommission = amountEarned * LEVEL_ONE_PERCENTAGE;
      levelOneUser.balance += levelOneCommission;
      levelOneUser.referralEarnings = (levelOneUser.referralEarnings || 0) + levelOneCommission;
      await levelOneUser.save();

      // 3. Level-2: the referrer of the referrer (if any)
      if (levelOneUser.referredBy) {
        const levelTwoUser = await UserModel.findById(levelOneUser.referredBy).exec();
        if (levelTwoUser) {
          const levelTwoCommission = amountEarned * LEVEL_TWO_PERCENTAGE;
          levelTwoUser.balance += levelTwoCommission;
          levelTwoUser.referralEarnings = (levelTwoUser.referralEarnings || 0) + levelTwoCommission;
          await levelTwoUser.save();
        }
      }
    }
  }
};
