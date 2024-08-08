import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '@src/models/taskModel';
import User from '@src/models/userModel';
import dbConnect from '@src/lib/dbConnect';

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Aggregate data for tasks
    const taskAggregationPipeline = [
      {
        $facet: {
          totalTasks: [{ $count: "count" }],
          totalEarnings: [{ $group: { _id: null, totalEarnings: { $sum: "$reward" } } }],
          totalDeposits: [{ $group: { _id: null, totalDeposits: { $sum: "$reward" } } }], // Assume deposits are the same as rewards for simplicity
          totalWithdrawals: [{ $group: { _id: null, totalWithdrawals: { $sum: "$reward" } } }], // Assume withdrawals are the same as rewards for simplicity
          tasksList: [
            {
              $project: {
                title: 1,
                createdBy: 1,
                reward: 1,
                status: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          totalTasks: { $arrayElemAt: ["$totalTasks.count", 0] },
          totalEarnings: { $arrayElemAt: ["$totalEarnings.totalEarnings", 0] },
          totalDeposits: { $arrayElemAt: ["$totalDeposits.totalDeposits", 0] },
          totalWithdrawals: { $arrayElemAt: ["$totalWithdrawals.totalWithdrawals", 0] },
          tasksList: "$tasksList"
        }
      }
    ];

    const [taskStats] = await Task.aggregate(taskAggregationPipeline);

    // Aggregate data for users
    const userAggregationPipeline = [
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          totalEarnings: [{ $group: { _id: null, totalEarnings: { $sum: "$earnings" } } }],
          totalDeposits: [{ $group: { _id: null, totalDeposits: { $sum: "$totalAmount" } } }],
          totalWithdrawals: [{ $group: { _id: null, totalWithdrawals: { $sum: "$totalAmount" } } }],
          usersList: [
            {
              $project: {
                username: 1,
                totalAmount: 1,
                earnings: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },
          totalEarnings: { $arrayElemAt: ["$totalEarnings.totalEarnings", 0] },
          totalDeposits: { $arrayElemAt: ["$totalDeposits.totalDeposits", 0] },
          totalWithdrawals: { $arrayElemAt: ["$totalWithdrawals.totalWithdrawals", 0] },
          usersList: "$usersList"
        }
      }
    ];

    const [userStats] = await User.aggregate(userAggregationPipeline);

    return NextResponse.json({
      taskStats,
      userStats
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
