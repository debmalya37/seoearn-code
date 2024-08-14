"use client";

import React, { useState, useTransition } from 'react';
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

async function fetchTasks(page: number, limit: number) {
    const res = await fetch(`http://www.seoearningspace.com/api/tasks?page=${page}&limit=${limit}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.tasks)) {
        return {
            tasks: data.tasks,
            totalTasks: data.totalTasks,
        };
    } else {
        throw new Error(data.message || 'Failed to fetch tasks');
    }
}

const TasksPage = ({ initialTasks, initialTotalTasks }: { initialTasks: Task[], initialTotalTasks: number }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [totalTasks, setTotalTasks] = useState<number>(initialTotalTasks);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPending, startTransition] = useTransition();
    const limit = 10; // Number of tasks per page
    const { data: session } = useSession();

    const handlePageChange = async (page: number) => {
        startTransition(async () => {
            try {
                const { tasks: newTasks, totalTasks: newTotalTasks } = await fetchTasks(page, limit);
                setTasks(newTasks);
                setTotalTasks(newTotalTasks);
                setCurrentPage(page);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        });
    };

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

    // if (!session || !session.user || (session.user.email !== 'debmalyasen37@gmail.com' && session.user.email !== 'souvik007b@gmail.com')) {
    //     return (
    //         <div className="flex justify-center items-center h-full">
    //             <div className="text-center">
    //                 <h1 className="text-2xl font-bold">Access Denied</h1>
    //                 <p className="mt-4">Please sign in as an admin to view this page.</p>
    //                 <Link href="/sign-in">
    //                     <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
    //                         Sign In
    //                     </span>
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

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
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(totalTasks / limit)}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(totalTasks / limit)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

// Fetch initial data server-side
async function getInitialData() {
    const page = 1; // Start from the first page
    const limit = 10; // Number of tasks per page
    try {
        const { tasks, totalTasks } = await fetchTasks(page, limit);
        return { initialTasks: tasks, initialTotalTasks: totalTasks };
    } catch (error) {
        console.error('Failed to fetch initial data:', error);
        return { initialTasks: [], initialTotalTasks: 0 };
    }
}

export default async function Page() {
    const { initialTasks, initialTotalTasks } = await getInitialData();
    return <TasksPage initialTasks={initialTasks} initialTotalTasks={initialTotalTasks} />;
}
