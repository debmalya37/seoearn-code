import { v4 as uuidv4 } from 'uuid';

export const generateReferralCode = (username: string, userId: string): string => {
  // Take the first 3 characters of the username and the last 3 characters of the user ID
  const usernamePart = username.slice(0, 3);
  const userIdPart = userId;
  return `${usernamePart}${userIdPart}`;
};

export const generateReferralLink = (referralCode: string): string => {
  const domain = process.env.DOMAIN || 'https://seoearningspace.com'; // Use environment variable for the domain
  return `${domain}/sign-up?ref=${referralCode}`;
};
