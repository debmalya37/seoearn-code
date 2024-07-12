import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@src/models/userModel';
import Task from '@src/models/taskModel';
import dbConnect from '@src/lib/dbConnect';

export async function GET() {
try {
// connection of mongodb 
dbConnect();

// Users aggregation pipeline
const usersAggregationPipeline = [
    {
    $facet: {
        totalUsers: [{ $count: "count" }],
        avgAge: [{ $group: { _id: null, averageAge: { $avg: "$age" } } }],
        genderCount: [
        {
            $group: {
            _id: "$gender",
            count: { $sum: 1 }
            }
        }
        ],
        activeUsers: [
        { $match: { isVerified: true } },
        { $count: "count" }
        ],
        userList: [
        {
            $project: {
            username: 1,
            email: 1,
            gender: 1,
            age: 1,
            isVerified: 1
            }
        }
        ]
    }
    },
    {
    $project: {
        totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },
        avgAge: { $arrayElemAt: ["$avgAge.averageAge", 0] },
        totalMaleUsers: {
        $arrayElemAt: [
            {
            $filter: {
                input: "$genderCount",
                as: "gender",
                cond: { $eq: ["$$gender._id", "male"] }
            }
            },
            0
        ]
        },
        totalFemaleUsers: {
        $arrayElemAt: [
            {
            $filter: {
                input: "$genderCount",
                as: "gender",
                cond: { $eq: ["$$gender._id", "female"] }
            }
            },
            0
        ]
        },
        activeUsers: { $arrayElemAt: ["$activeUsers.count", 0] },
        userList: "$userList"
    }
    },
    {
    $project: {
        totalUsers: 1,
        avgAge: 1,
        totalMaleUsers: { $ifNull: ["$totalMaleUsers.count", 0] },
        totalFemaleUsers: { $ifNull: ["$totalFemaleUsers.count", 0] },
        activeUsers: { $ifNull: ["$activeUsers", 0] },
        userList: 1
    }
    }
];

// Tasks aggregation pipeline
const tasksAggregationPipeline = [
    {
    $facet: {
        totalTasks: [{ $count: "count" }],
        taskList: [
        {
            $project: {
            title: 1,
            description: 1,
            rating: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1
            }
        }
        ]
    }
},
{
    $project: {
    totalTasks: { $arrayElemAt: ["$totalTasks.count", 0] },
    taskList: "$taskList"
    }
    }
];

// Execute the aggregation pipelines
const [userStats] = await User.aggregate(usersAggregationPipeline);
const [taskStats] = await Task.aggregate(tasksAggregationPipeline);

return NextResponse.json({
    userStats,
    taskStats
});
} catch (error) {
console.error('Error fetching stats:', error);
return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
}
}
