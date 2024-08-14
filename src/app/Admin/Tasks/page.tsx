"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@src/components/admin/Sidebar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
interface Task {
    _id: string;
    title: string;
    description: string;
    rating: number;
    status: string;
    reward: number;
    maxUsersCanDo: number;
}

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { data: session } = useSession();
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/tasks');
                const data = await res.json();
                if (data.success && Array.isArray(data.tasks)) {
                    setTasks(data.tasks);
                } else {
                    console.error('Failed to fetch tasks:', data.message);
                }
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchTasks();
    }, []);

    const handleApprove = async (taskId: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'approved' }),
            });
            const data = await res.json();
            if (data.success) {
                setTasks(tasks.map(task => 
                    task._id === taskId ? { ...task, status: 'approved' } : task
                ));
            } else {
                console.error('Failed to approve task:', data.message);
            }
        } catch (error) {
            console.error('Failed to approve task:', error);
        }
    };

    const handleReject = async (taskId: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'rejected' }),
            });
            const data = await res.json();
            if (data.success) {
                setTasks(tasks.map(task => 
                    task._id === taskId ? { ...task, status: 'rejected' } : task
                ));
            } else {
                console.error('Failed to reject task:', data.message);
            }
        } catch (error) {
            console.error('Failed to reject task:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (!session || !session.user || (session.user.email !== 'debmalyasen37@gmail.com' && session.user.email !== 'souvik007b@gmail.com')) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="mt-4">Please sign in as an admin to view this page.</p>
                    <Link href="/sign-in">
                        <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            Sign In
                        </span>
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Tasks</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Title</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Rating</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Reward</th>
                                <th className="py-2 px-4 border">Max users can do</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td className="py-2 px-4 border">
                                        <Link href={`/Admin/Utask/${task._id}`}>
                                        <span className="text-blue-500 hover:underline">{task.title}</span>
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 border">{task.description}</td>
                                    <td className="py-2 px-4 border">{task.rating}</td>
                                    <td className="py-2 px-4 border">{task.status}</td>
                                    <td className="py-2 px-4 border">${task.reward}</td>
                                    <td className="py-2 px-4 border">{task.maxUsersCanDo}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleApprove(task._id)}
                                            className="bg-green-500 text-white px-4 py-1 rounded mr-2 hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(task._id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
