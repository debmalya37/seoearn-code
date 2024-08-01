// src/lib/twilioClient.ts
import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_SERVICE_SID!;

const twilioClient = Twilio(accountSid, authToken);

export { twilioClient, serviceSid };
