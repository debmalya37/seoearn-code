import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { Message } from "twilio/lib/twiml/MessagingResponse";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    // code not needed due to nextjs updated already by itself to recognise these issues
    // // todo use this in all other routes
    // if(request.method!== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: "method not allowed",
    //     }, {status: 405}
    //     )
    // }

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod 
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); // todo remove console.log 

        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                Message: usernameErrors.length > 0? usernameErrors.join(',') :
                "Invalid query parameters",
            }, {status: 400})
        }


        const {username} = result.data

        const existingVerifieduser =  await UserModel.findOne({username, isVerified: true})

        if(existingVerifieduser) {
            return Response.json({
                success: false,
                Message: "username is already taken",
            }, {status: 400})
        }
        return Response.json({
            success: true,
            Message: "Username is available",
        }, {status: 200}
        )

    } catch (error) {
        console.error("error checking username ", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },
        {status: 500}
        )
    }
}


