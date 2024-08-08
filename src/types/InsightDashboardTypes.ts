export interface TaskStats {
    totalTasks: number;
    totalEarnings: number;
    totalDeposits: number;
    totalWithdrawals: number;
  }
  
  export interface InsightsData {
    taskStats: TaskStats;
    userStats: {
      totalUsers: number;
      totalEarnings: number;
      totalDeposits: number;
      totalWithdrawals: number;
      usersList: Array<{
        username: string;
        totalAmount: number;
        earnings: number;
      }>;
    };
  }
  