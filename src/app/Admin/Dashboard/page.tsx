"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@src/components/admin/Sidebar';
import Header from '@src/components/admin/Header';
import Card from '@src/components/admin/Card';
import OverviewGraph from '@src/components/admin/OverviewGraph';
import RecentSales from '@src/components/admin/RecentSales';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Task {
    _id: string;
    title: string;
    createdBy: string;
    reward: number;
    status: string;
    rating: number;
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/tasks/completed');
                if (!res.ok) {
                    throw new Error(`Network response was not ok: ${res.statusText}`);
                }
                const data = await res.json();

                if (data.success && Array.isArray(data.tasks)) {
                    // Sort and get the top 5 tasks by reward
                    const topTasks = data.tasks
                        .sort((a: Task, b: Task) => b.reward - a.reward)
                        .slice(0, 5);

                    setTasks(topTasks);
                    setFilteredTasks(topTasks);
                } else {
                    console.error('Invalid data structure received:', data);
                    setError('Invalid data structure received');
                }
            } catch (error: any) {
                console.error('Failed to fetch tasks:', error);
                setError('Failed to fetch tasks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        // Filter tasks based on the search term
        const results = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.reward.toString().includes(searchTerm.toLowerCase())
        );
        setFilteredTasks(results);
    }, [searchTerm, tasks]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!session || !session.user || (session.user.email !== 'debmalyasen37@gmail.com' && session.user.email !== 'souvik007b@gmail.com')) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="mt-4">Please sign in as an admin to view this dashboard.</p>
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
                <Header />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card title="Total Revenue" value="$45,231.89" />
                    <Card title="Subscriptions" value="+2350" />
                    <Card title="Sales" value="+12,234" />
                    <Card title="Active Now" value="+573" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <OverviewGraph />
                </div>
                <div className="my-4">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <RecentSales tasks={filteredTasks} />
            </div>
        </div>
    );
};

export default Dashboard;
