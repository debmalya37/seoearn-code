"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import TaskCard from "@src/components/TaskCard";
import TaskDetails from "@src/components/TaskDetails";
import AddTaskModal from "@src/components/AddTaskModal";
import Nav from "@src/components/Nav";
import { ITask } from "@src/models/taskModel";
import { useToast } from "@src/components/ui/use-toast";
import { useSession, signOut, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@src/schemas/TaskSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@src/types/ApiResponse";
import Link from "next/link";
import { Button } from "@src/components/ui/button";

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
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDeleteMessage = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  const form = useForm({
    resolver: zodResolver(taskSchema),
  });

  const { register, watch, setValue } = form;

  const fetchTasks = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const response = await axios.get<ApiResponse>("/api/tasks", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        setTasks(response.data.tasks || []);
        if (refresh) {
          toast({
            title: "Refresh Messages",
            description: "Showing latest tasks",
          });
        }
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
    [setIsLoading, setTasks, toast]
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
        fetchTasks(false);
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
    fetchTasks(true);
  }, [session, setValue, fetchTasks]);

  const handleOpenAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (!session || !session.user) {
    return <Link href="/sign-in">PLEASE LOGIN</Link>;
  }

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        {/* Task List */}
        <div className="w-3/5 bg-purple-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <input
              type="text"
              placeholder="search"
              className="border rounded-md py-2 px-4"
              value={searchInput}
              onChange={handleSearchChange}
            />
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
        <div className="w-2/5 bg-yellow-50 p-4">
          <TaskDetails task={selectedTask} />
        </div>
        <button
          onClick={handleOpenAddTaskModal}
          className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add New Task
        </button>
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={handleCloseAddTaskModal}
          onSubmit={handleSubmitAddTask}
          createdBy={session.user.email}
        />
      </div>
    </>
  );
};

export default TasksPage;
