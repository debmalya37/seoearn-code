import React from 'react';
import Link from 'next/link';

interface Task {
    _id: string;
    title: string;
    createdBy: string;
    reward: number;
    rating: number;
}

interface RecentSalesProps {
    tasks: Task[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ tasks }) => {
    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
            <ul>
                {tasks.map((task) => (
                    <li
                        key={task._id}
                        className="flex justify-between items-center py-2"
                    >
                        <Link href={`/Admin/Utask/${task._id}`} passHref>
                            <span className="flex justify-between items-center w-full">
                                <div>
                                    <h4 className="font-semibold">{task.title}</h4>
                                    <p className="text-sm text-gray-600">By {task.createdBy}</p>
                                    <p className="text-sm text-gray-600">Rating: {task.rating}</p>
                                </div>
                                <div className="font-semibold">${task.reward.toFixed(2)}</div>
                            </span>
                        </Link>a
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentSales;
