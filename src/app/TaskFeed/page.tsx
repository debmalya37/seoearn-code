"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import AddTaskModal from "@src/components/AddTaskModal";
import { ITask } from "@src/models/taskModel";
import { useToast } from "@src/components/ui/use-toast";
import { useSession, getSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { ApiResponse } from "@src/types/ApiResponse";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@src/components/ui/select";
import { Input } from "@src/components/ui/input";
import Feedside from "@src/components/Feedside";

// Category options
const categoryOptions = [
  "Nothing is selected",
  "Registration only",
  "Registration with activity",
  "Activity only",
  "Bonuses",
  "YouTube",
  "Instagram",
  "Vkontakte",
  "FaceBook",
  "Telegram",
  "Other social networks",
  "Review/vote",
  "Posting",
  "Copyright, rewrite",
  "Captcha",
  "Transfer of points, credits",
  "Invest",
  "Forex",
  "Games",
  "Mobile Apps",
  "Downloading files",
  "Choose a referrer on SEOSPRINT",
  "Other",
];

export interface TaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string;
  reward: number;
  status?: string;
  createdAt?: string;
  maxUsersCanDo: number;
  // is18Plus?: boolean;
}

const TasksPage: FC = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    duration: "",
    reward: "",
  });
  const [sortBy, setSortBy] = useState("createdAt"); // default sorting by creation date
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { data: session } = useSession();

  // Fetch tasks from server
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await getSession();
      const query = new URLSearchParams({
        ...filters,
        sortBy,
        page: String(currentPage),
        limit: "10",
      }).toString();

      const response = await axios.get<ApiResponse>(`/api/tasks?${query}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setTasks(response.data.tasks || []);
      setTotalPages(Math.ceil(response.data.totalTasks / 10));
      toast({
        title: "Tasks Updated",
        description: "Tasks have been updated based on filters and sorting.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, currentPage, toast]);

  // Add a new task
  const handleSubmitAddTask = async (task: TaskData) => {
    try {
      const session = await getSession();
      const response = await axios.post<ApiResponse>("/api/tasks", task, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (response.data.success) {
        fetchTasks();
        toast({
          title: "Task added",
          description: response.data.message,
        });
        setIsAddTaskModalOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchTasks();
  }, [session, fetchTasks]);

  // Handlers for filters & search
  const handleOpenAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };
  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  const handleSelectFilterChange = (name: string) => (value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter tasks by search
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      task.description.toLowerCase().includes(searchInput.toLowerCase()) ||
      task.category.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (!session || !session.user) {
    return (
      <Link href="/sign-in">
        <Button>PLEASE LOGIN</Button>
      </Link>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Feedside />

      {/* Main Content: filters on top, tasks below */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Filters Section */}
        <div className="p-4 border-b border-gray-300 bg-white text-black">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">All Tasks</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Search by title, description or category"
                className="border rounded-md py-2 px-4 w-80"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <Button onClick={handleOpenAddTaskModal}>Add Task</Button>
            </div>
          </div>

          {/* Filter Rows */}
          <div className="flex flex-wrap gap-4 text-black">
            {/* Status */}
            <Select onValueChange={handleSelectFilterChange("status")}>
              <SelectTrigger className="border rounded-md py-2 px-4 text-black">
                <SelectValue placeholder="Select Status" />
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
              </SelectTrigger>
            </Select>

            {/* Category */}
            <Select onValueChange={handleSelectFilterChange("category")}>
              <SelectTrigger className="border rounded-md py-2 px-4 text-black">
                <SelectValue placeholder="Select Category" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>

            {/* Duration */}
            <Input
              type="number"
              name="duration"
              placeholder="Max Duration"
              className="border rounded-md py-2 px-4 text-black"
              value={filters.duration}
              onChange={handleFilterChange}
            />

            {/* Reward */}
            <Input
              type="number"
              name="reward"
              placeholder="Min Reward"
              className="border rounded-md py-2 px-4 text-black"
              value={filters.reward}
              onChange={handleFilterChange}
            />

            {/* Sort By */}
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="border rounded-md py-2 px-4 text-black">
                <SelectValue placeholder="Sort By" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="createdAt">
                      Date Created (Latest to Oldest)
                    </SelectItem>
                    <SelectItem value="-createdAt">
                      Date Created (Oldest to Latest)
                    </SelectItem>
                    <SelectItem value="reward">
                      Reward (Highest to Lowest)
                    </SelectItem>
                    <SelectItem value="-reward">
                      Reward (Lowest to Highest)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
        </div>

        {/* Task List Section */}
        <div className="flex-1 p-4 overflow-y-auto">
  {isLoading ? (
    <p>Loading tasks...</p>
  ) : filteredTasks.length > 0 ? (
    <table className="table-auto w-full border-separate border-spacing-y-3">
      <thead className="bg-green-700 text-white">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Title
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Description
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Rating
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Category
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Status
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Reward
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium uppercase break-words">
            Created At
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredTasks.map((task) => (
          <tr
            key={String(task._id)}
            className="bg-white shadow-lg hover:shadow-xl text-sm rounded-md"
          >
            <td className="px-4 py-2 break-words">
              <Link
                href={`/TaskFeed/${task._id}`}
                className="text-blue-600 hover:underline"
              >
                {task.title}
              </Link>
            </td>
            <td className="px-4 py-2 break-words">{task.description}</td>
            <td className="px-4 py-2 break-words">{task.rating}</td>
            <td className="px-4 py-2 break-words">{task.category}</td>
            <td className="px-4 py-2 break-words">
              {task.status || "Pending"}
            </td>
            <td className="px-4 py-2 break-words">{task.reward}</td>
            <td className="px-4 py-2 break-words">
              {new Date(task.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No tasks found</p>
  )}

  {/* Pagination Controls */}
  <div className="flex justify-between items-center mt-4">
    <div className="flex space-x-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  </div>
</div>

      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={handleCloseAddTaskModal}
        onSubmit={handleSubmitAddTask}
        createdBy={session.user.email}
      />
    </div>
  );
};

export default TasksPage;
