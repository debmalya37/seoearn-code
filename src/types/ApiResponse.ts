import { ITask } from "@src/models/taskModel";
import  {IMessage}  from "@src/models/userModel";
import  Task  from "@src/models/userModel";
export interface ApiResponse{
    taskStats: any;
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    isfreelancer?: boolean;
    messages?: Array<IMessage>;
    tasks?: Array<ITask>;
}