// src/types/task.ts

export interface TaskData {
    // is18Plus: Boolean | undefined;
    title: string;
    description: string;
    rating: number;
    category: string;
    duration: string;
    createdBy: string;
    createdAt?: string;
    reward: number;
    status?: string; // Assuming `status` might be an optional field
    maxUsersCanDo: number;
  }
  