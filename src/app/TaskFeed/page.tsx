"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import TaskCard from "@src/components/TaskCard";
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
} from "@src/components/ui/select"; // Import shadcn UI Select components
import { Input } from "@src/components/ui/input";

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
}

const TasksPage: FC = () => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    duration: '',
    reward: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDeleteMessage = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  const fetchTasks = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const query = new URLSearchParams({
          ...filters,
          sortBy
        }).toString();
        const response = await axios.get<ApiResponse>(`/api/tasks?${query}`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        setTasks(response.data.tasks || []);
        toast({
          title: "Tasks Updated",
          description: "Tasks have been updated based on filters and sorting.",
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message || "Failed to fetch tasks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortBy, toast]
  );

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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (!session || !session.user) {
    return <Link href="/sign-in"><Button>PLEASE LOGIN</Button></Link>;
  }

  return (
    <>
      <div className="flex h-full">
        {/* Sidebar */}
        {/* Task List */}
        <div className="w-4/5 bg-purple-100 p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <input
              type="text"
              placeholder="search"
              className="border rounded-md py-2 px-4"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <div className="flex space-x-4">
              <Select onValueChange={handleSelectFilterChange('status')}>
                <SelectTrigger className="border rounded-md py-2 px-4">
                  <SelectValue placeholder="Select Status" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <Select onValueChange={handleSelectFilterChange('category')}>
                <SelectTrigger className="border rounded-md py-2 px-4">
                  <SelectValue placeholder="Select Category" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Categories</SelectItem>
                      {/* Add category options here */}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <Input
                type="number"
                name="duration"
                placeholder="Max Duration"
                onChange={handleFilterChange}
                className="border rounded-md py-2 px-4"
              />
              <Input
                type="number"
                name="reward"
                placeholder="Min Reward"
                onChange={handleFilterChange}
                className="border rounded-md py-2 px-4"
              />
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="border rounded-md py-2 px-4">
                  <SelectValue placeholder="Sort by" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="createdAt">Sort by Latest</SelectItem>
                      <SelectItem value="-createdAt">Sort by Oldest</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <><Link key={String(task._id)} href={`/TaskFeed/${task._id}`}>
                  <TaskCard
                    title={task.title}
                    description={task.description}
                    rating={task.rating}
                    category={task.category}
                    status={task.status || "Pending"}
                    createdAt={task.createdAt} id={(task._id) as string} />
                </Link><br /></>
              ))
            ) : (
              <p>No tasks found</p>
            )}
          </div>
          <div className="flex justify-between items-center mt-4 pb-6">
            <button className="text-purple-700">Previous</button>
            <div className="space-x-2">
              <button className="text-purple-700">1</button>
              <button className="text-purple-700">2</button>
              <button className="text-purple-700">3</button>
              <button className="text-purple-700">4</button>
              <button className="text-purple-700">5</button>
              <button className="text-purple-700">6</button>
              <button className="text-purple-700">7</button>
            </div>
            <button className="text-purple-700">Next</button>
          </div>
        </div>
        {/* Task Details */}
        {/* <div className="w-2/5 bg-yellow-50 p-4">
          <TaskDetails
            task={selectedTask}
          />
        </div> */}
      </div>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={handleCloseAddTaskModal}
        onSubmit={handleSubmitAddTask} createdBy={session.user.email}      />
    </>
  );
};

export default TasksPage;
