// helpers/sendVerificationSMS.ts
import twilio from 'twilio';
import { ApiResponse } from '@src/types/ApiResponse';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendVerificationSMS(phoneNumber: string, otp: string): Promise<ApiResponse> {
    try {
        await client.messages.create({
            body: `Your verification code is ${otp}`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });

        return { success: true, message: 'Verification SMS sent successfully' };
    } catch (error) {
        console.error('Error sending verification SMS:', error);
        return { success: false, message: 'Failed to send verification SMS' };
    }
}
