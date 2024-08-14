import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';
import Task from '@src/models/taskModel';

export async function GET() {
    try {
        await dbConnect();

        // Fetch user stats
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({ isVerified: true });
        const avgAge = (await User.aggregate([{ $group: { _id: null, averageAge: { $avg: "$age" } } }]))[0]?.averageAge || 0;

        const genderCount = await User.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        const totalMaleUsers = genderCount.find(gender => gender._id === 'male')?.count || 0;
        const totalFemaleUsers = genderCount.find(gender => gender._id === 'female')?.count || 0;

        const userList = await User.find({}, 'username email gender age isVerified');

        // Fetch task stats
        const totalTasks = await Task.countDocuments({});
        const taskList = await Task.find({}, 'title description rating category createdAt createdBy status is18Plus');

        // Set cache control headers to prevent caching
        const response = NextResponse.json({
            userStats: {
                totalUsers,
                avgAge,
                totalMaleUsers,
                totalFemaleUsers,
                activeUsers,
                userList
            },
            taskStats: {
                totalTasks,
                taskList
            }
        });
        response.headers.set('Cache-Control', 'no-store');

        return response;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
