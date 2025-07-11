// src/utils/referral.ts
import { v4 as uuidv4 } from 'uuid';

export const generateReferralCode = (username: string, phoneNumber: string): string => {
  const usernamePart = username.slice(0, 3).toUpperCase();
  const phonePart = phoneNumber.slice(-4); // Last 4 digits of phone number
  return `${usernamePart}${phonePart}`;
};

export const generateReferralLink = (referralCode: string): string => {
  const domain = process.env.DOMAIN || 'https://seoearningspace.com';
  return `${domain}/sign-up?ref=${referralCode}`;
};
