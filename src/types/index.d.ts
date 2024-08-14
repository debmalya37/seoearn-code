import { ObjectId } from "mongoose";

export interface Task {
    _id: string;
    user: string;
    title: string;
    description: string;
    category: string;
    reward?: number; // If reward is optional
    rating?: number; // If rating is optional
    status?: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    createdBy?: Types.ObjectId;
    maxUsersCanDo: number;
    
  }
  