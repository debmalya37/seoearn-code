// src/types/task.ts

export interface TaskData {
    // is18Plus: Boolean | undefined;
    title: string;
    description: string;
    notes?: string;
    fileUrl?: string;
    rating: number;
    category: string;
    duration: number;
    createdBy: string;
    createdAt?: string;
    reward: number;
    budget: number;
    status?: string; // Assuming `status` might be an optional field
    maxUsersCanDo: number;
    isApproved: false,   // new field
  isRejected: false ,
  is18Plus: boolean;

  }
  