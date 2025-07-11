// src/app/taskfeed/page.tsx
'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import AddTaskModal from '@src/components/AddTaskModal';
import { ITask } from '@src/models/taskModel';
import { useToast } from '@src/components/ui/use-toast';
import { useSession, getSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { Button } from '@src/components/ui/button';
import { ApiResponse } from '@src/types/ApiResponse';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@src/components/ui/select';
import { Input } from '@src/components/ui/input';
import Feedside from '@src/components/Feedside';

// Category options remain the same
const categoryOptions = [
  'Nothing is selected',
  'Registration only',
  'Registration with activity',
  'Activity only',
  'Bonuses',
  'YouTube',
  'Instagram',
  'Vkontakte',
  'FaceBook',
  'Telegram',
  'Other social networks',
  'Review/vote',
  'Posting',
  'Copyright, rewrite',
  'Captcha',
  'Transfer of points, credits',
  'Invest',
  'Forex',
  'Games',
  'Mobile Apps',
  'Downloading files',
  'Choose a referrer on SEOSPRINT',
  'Other',
];

export interface TaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: number; // Changed to number for consistency
  createdBy: string;
  reward: number;
  status?: string;
  createdAt?: string;
  maxUsersCanDo: number;
}




const TaskFeedPage: FC = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    duration: '',
    reward: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { data: session } = useSession();

  // Build query string, omitting `status` or `category` if they're "all"
  const buildQueryString = () => {
    const q: Record<string, string> = { sortBy, page: String(currentPage), limit: '12' };
    if (filters.status !== 'all') q.status = filters.status;
    if (filters.category !== 'all') q.category = filters.category;
    if (filters.duration) q.duration = filters.duration;
    if (filters.reward) q.reward = filters.reward;
    return new URLSearchParams(q).toString();
  };

  // Fetch tasks from server
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const sess = await getSession();
      const query = buildQueryString();
      const response = await axios.get<ApiResponse>(`/api/tasks?${query}`, {
        headers: {
          Authorization: `Bearer ${sess?.accessToken}`,
        },
      });
      setTasks(response.data.tasks || []);
      setTotalPages(Math.ceil(response.data.totalTasks / 12));
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error fetching tasks',
        description: axiosErr.response?.data.message || 'Unable to load tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, currentPage, toast]);

  // Add a new task
  const handleSubmitAddTask = async (task: TaskData) => {
    try {
      const sess = await getSession();
      const response = await axios.post<ApiResponse>('/api/tasks', task, {
        headers: {
          Authorization: `Bearer ${sess?.accessToken}`,
        },
      });
      if (response.data.success) {
        fetchTasks();
        toast({
          title: 'Task added',
          description: response.data.message,
        });
        setIsAddTaskModalOpen(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchTasks();
  }, [session, fetchTasks]);

  // Handlers for search & filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectFilterChange = (name: string) => (value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      task.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      task.category.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Please Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Left Sidebar */}
      <Feedside />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header: Search + Filters */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Task Feed
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={handleSearchChange}
                className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                + Add Task
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status Filter */}
            <Select onValueChange={handleSelectFilterChange('status')}>
              <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select onValueChange={handleSelectFilterChange('category')}>
              <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Duration Filter */}
            <Input
              type="number"
              name="duration"
              placeholder="Max Duration (min)"
              value={filters.duration}
              onChange={handleFilterChange}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg py-2 px-3"
            />

            {/* Reward Filter */}
            <Input
              type="number"
              name="reward"
              placeholder="Min Reward ($)"
              value={filters.reward}
              onChange={handleFilterChange}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg py-2 px-3"
            />

            {/* Sort By */}
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="-createdAt">Oldest First</SelectItem>
                  <SelectItem value="reward">Reward: High → Low</SelectItem>
                  <SelectItem value="-reward">Reward: Low → High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-700 dark:text-gray-300">Loading…</p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={String(task._id)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
                >
                  {/* Cover / Emoji */}
                  <div className="h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-t-2xl flex items-center justify-center">
                    <span className="text-5xl">📝</span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <Link
                      href={`/TaskFeed/${task._id}`}
                      className="hover:underline"
                    >
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                        {task.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {task.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Rating: {task.rating}/5
                      </span>
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                        ${task.reward.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>

                      {/* Status badge */}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                          ${
                            task.status === 'Approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                              : task.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                              : task.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                              : task.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }
                        `}
                      >
                        {task.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-700 dark:text-gray-300">No tasks found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="self-center text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleSubmitAddTask}
        createdBy={session.user.email}
      />
    </div>
  );
};

export default TaskFeedPage;
