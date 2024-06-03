import { ITask } from "@/models/taskModel";
import  {IMessage}  from "@/models/userModel";
import  Task  from "@/models/userModel";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    isfreelancer?: boolean;
    messages?: Array<IMessage>;
    tasks?: Array<ITask>;
}