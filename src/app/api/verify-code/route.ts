import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import {z}  from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// todo zod implementation I can do it later not so needed now , as an extra feature


export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} =  await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})


        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                }, 
                {status: 500}
            )
        }

        // is the code valid to now as per date and time from database data and time
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()


        // user verification code inputs the correct code and not expired yet
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            // message to the user after account verification successful
            return Response.json(
                {
                    success: true,
                    message: "Account Verified Successfully"
                }, 
                {status: 200}
            )
        }
        // when the user inputs the verification code which has already been expired
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "verification code has expired! Please signup again to get a new code!"
                }, 
                {status: 400}
            )

        } 
        // when the user inputs the incorrect verification code 
        else {
            return Response.json(
                {
                    success: false,
                    message: "incorrect verification code"
                }, 
                {status: 200}
            )
        }
    } 
    
    catch (error) {
        console.error("Error verifying User ", error)

        return Response.json(
            {
                success: false,
                message: "Error verifying User"
            },
            {status: 500}
        )
    }
}