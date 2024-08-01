import { authOptions } from "@src/app/api/auth/[...nextauth]/options";
import UserModel from "@src/models/userModel";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

const LEVEL_ONE_PERCENTAGE = 0.0025; // 0.25%
const LEVEL_TWO_PERCENTAGE = 0.005;  // 0.5%


export const handleReferralEarnings = async (userId: Types.ObjectId, taskEarnings: number) => {
    const session = await getServerSession(authOptions);
const user = await UserModel.findOne({email: session?.user.email});
if (!user) throw new Error("User not found");

const levelOneUser = user.referredBy ? await UserModel.findById(user.referredBy) : null;
if (levelOneUser) {
const levelOneEarnings = taskEarnings * LEVEL_ONE_PERCENTAGE;
levelOneUser.balance += levelOneEarnings;
await levelOneUser.save();

const levelTwoUser = levelOneUser.referredBy ? await UserModel.findById(levelOneUser.referredBy) : null;
if (levelTwoUser) {
    const levelTwoEarnings = taskEarnings * LEVEL_TWO_PERCENTAGE;
    levelTwoUser.balance += levelTwoEarnings;
    await levelTwoUser.save();
}
}
};
