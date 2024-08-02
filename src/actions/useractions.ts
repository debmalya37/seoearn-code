import username from "@src/app/[Username]/page";
import dbConnect from "@src/lib/dbConnect";
import UserModel from "@src/models/userModel";


export const  fetchUser = async (username: any)=> {
    await dbConnect()
    let u = await UserModel.findOne({username:username})
    let user = u.toObject({flattentObjectIds: true})
    return user
}

