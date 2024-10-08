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
} from "@src/components/ui/select"; 
import { Input } from "@src/components/ui/input";

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
  "Other"
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
  // is18Plus?: Boolean;
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
  const [sortBy, setSortBy] = useState('createdAt'); // default sorting by creation date
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { data: session } = useSession();

  const fetchTasks = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const query = new URLSearchParams({
          ...filters,
          sortBy,
          page: String(currentPage),
          limit: '10'
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
          description: axiosError.response?.data.message || "Failed to fetch tasks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortBy, currentPage, toast]
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Updated search logic to filter by title, description, and category
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    task.description.toLowerCase().includes(searchInput.toLowerCase()) ||
    task.category.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (!session || !session.user) {
    return <Link href="/sign-in"><Button>PLEASE LOGIN</Button></Link>;
  }

  return (
    <>
      <div className="flex h-full">
        <div className="w-4/5 bg-purple-100 p-4 h-full">
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">All Tasks</h1>
              <input
                type="text"
                placeholder="Search by title, description or category"
                className="border rounded-md py-2 px-4 w-80"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <Button onClick={() => handleOpenAddTaskModal()}>Add Task</Button>
            </div>
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
                      <SelectItem value="Completed">Completed</SelectItem>
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
                      {categoryOptions.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <Input
                type="number"
                name="duration"
                placeholder="Max Duration"
                className="border rounded-md py-2 px-4"
                value={filters.duration}
                onChange={handleFilterChange}
              />
              <Input
                type="number"
                name="reward"
                placeholder="Min Reward"
                className="border rounded-md py-2 px-4"
                value={filters.reward}
                onChange={handleFilterChange}
              />
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="border rounded-md py-2 px-4">
                  <SelectValue placeholder="Sort By" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="createdAt">Date Created (Latest to Oldest)</SelectItem>
                      <SelectItem value="-createdAt">Date Created (Oldest to Latest)</SelectItem>
                      <SelectItem value="reward">Reward (Highest to Lowest)</SelectItem>
                      <SelectItem value="-reward">Reward (Lowest to Highest)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
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
                    reward={task.reward}
                    // budget={task.budget || task.reward} 
                    createdAt={task.createdAt} 
                    // maxUsersCanDo={task.maxUsersCanDo}
                    id={String(task._id)} />
                </Link><br /></>
              ))
            ) : (
              <p>No tasks found</p>
            )}
          </div>
            <div className="flex justify-between items-center mt-4">
              
              <div className="flex space-x-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
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
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={handleCloseAddTaskModal}
          onSubmit={handleSubmitAddTask} createdBy={session.user.email}        />
      </div>
    </>
  );
};

export default TasksPage;

