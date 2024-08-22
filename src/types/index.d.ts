import { ObjectId } from "mongoose";

export interface Task {
    _id: string;
    user: string;
    title: string;
    description: string;
    notes?: string;
    fileUrl?: string;
    category: string;
    reward?: number;
    budget?: number;
    rating?: number; // If rating is optional
    status?: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    createdBy?: Types.ObjectId;
    maxUsersCanDo: number;
    
  }
  