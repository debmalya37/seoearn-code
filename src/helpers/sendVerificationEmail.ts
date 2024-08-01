import {resend} from "@src/lib/resend";
import VerificationEmail from "../emails/VerificationEmail";
import { ApiResponse } from "@src/types/ApiResponse";




export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,

): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "SEO EARN || Verification Code",
            react: VerificationEmail({username, otp: verifyCode}),
        })
        return {success: true, message: "Verification email send successfully"}
    } catch (emailError) {
        console.log("Error sending verification email",emailError)
        return {success: false, message: "failed to send verification email"}
     }
}

