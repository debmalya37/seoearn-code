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
    budget: number;
    maxUsersCanDo: number;
}

async function fetchTasks(page: number, limit: number) {
    const res = await fetch(`http://seoearningspace.com/api/tasks?page=${page}&limit=${limit}`);
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

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">All Tasks</h1>
                        <div className="relative w-full sm:w-1/3">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                // You can hook up search functionality here later
                            />
                            <svg className="w-5 h-5 absolute top-2 left-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 4a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6z" />
                            </svg>
                        </div>
                    </div>

                    <div className="overflow-x-auto shadow-sm rounded-lg bg-white dark:bg-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Rating</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Reward</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Budget</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden xl:table-cell">Max Users</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {tasks.map((task) => (
                                    <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                            <Link href={`/Admin/Utask/${task._id}`}>
                                                <span className="hover:underline">{task.title}</span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden sm:table-cell truncate max-w-xs">
                                            {task.description}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden md:table-cell">
                                            {task.rating}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                            {task.status === 'approved' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                                                    Approved
                                                </span>
                                            ) : task.status === 'rejected' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                                                    Rejected
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden lg:table-cell">
                                            ${task.reward}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden lg:table-cell">
                                            ${task.budget}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden xl:table-cell">
                                            {task.maxUsersCanDo}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 flex justify-center">
                                            {task.status === 'approved' || task.status === 'rejected' ? (
                                                <span className="text-gray-500">N/A</span>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(task._id)}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(task._id)}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mb-2 sm:mb-0 inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page {currentPage} of {Math.ceil(totalTasks / limit)}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(totalTasks / limit)}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
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
