import dbConnect from "@src/lib/dbConnect";
import TaskModel from "@src/models/taskModel";
import UserModel from "@src/models/userModel";
import { handleReferralEarnings } from "@src/helpers/referralEarnings";

export async function handleTaskCompletion(taskId: string, earnings: any) {
  await dbConnect();

  const task = await TaskModel.findById(taskId).populate('assignedTo');
  if (!task) throw new Error("Task not found");

  task.status = 'completed';
  await task.save();

  const user = await UserModel.findById(task.assignedTo);
  if (!user) throw new Error("User not found");

  // Add task earnings to the user's balance
  user.balance += task.earnings;
  user.earnings += task.earnings;
  await user.save();

  // Handle referral earnings distribution
  await handleReferralEarnings(user._id, task.earnings);
}
