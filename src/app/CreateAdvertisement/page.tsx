"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@src/components/ui/use-toast";
import { ITask } from "@src/models/taskModel";
import Link from "next/link";
import AddTaskModal from "@src/components/AddTaskModal";
import { ApiResponse } from "@src/types/ApiResponse";
import InsightDashboard from "@src/components/InsightDashboard";
import { Button } from "@src/components/ui/button";
import AdsSide from "@src/components/AdsSide";

export interface AdsTaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  reward: number;
  budget: number;
  status?: string;
  createdAt?: string;
}

const CreateAdvertisement: FC = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [taskStats, setTaskStats] = useState<any>({});
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const handleToggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const fetchAdsTask = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);

      try {
        const session = await getSession();
        const response = await axios.get<ApiResponse>("api/ownTask", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        const fetchedTasks: ITask[] = response.data.tasks || [];
        setTasks(fetchedTasks);
        setTaskStats(response.data.taskPipeLine || {});

        // Update in-progress tasks
        setInProgressTasks(
          fetchedTasks.filter((task) => task.status === "In Progress")
        );

        if (refresh) {
          toast({
            title: "Refresh Tasks",
            description: "Showing latest tasks",
          });
        }
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
    },
    [setIsLoading, setTasks, setTaskStats, setInProgressTasks, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAdsTask(true);
  }, [session, fetchAdsTask]);

  const handleOpenAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleSubmitAddTask = async (task: AdsTaskData) => {
    try {
      const session = await getSession();
      const response = await axios.post<ApiResponse>("/api/tasks", task, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (response.data.success) {
        fetchAdsTask(true);
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

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        // Refetch tasks after updating status
        const response = await axios.get<ApiResponse>("/api/ownTask");
        const fetchedTasks: ITask[] = response.data.tasks ?? [];
        setInProgressTasks(
          fetchedTasks.filter((task) => task.status === "In Progress")
        );

        toast({
          title: "Task Status Updated",
          description: `Task ${taskId} status changed to ${newStatus}`,
        });
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (!session || !session.user) {
    return <Link href="/sign-in">PLEASE LOGIN</Link>;
  }

  return (
    <div className="flex">
      {/* Pass the open new task callback to AdsSide */}
      <AdsSide onOpenNewTask={handleOpenAddTaskModal} />

      <div className="p-4">
        <span>
          Welcome to Your Advertisement Dashboard, {session.user.username}!
        </span>
        <hr className="my-4" />
        <h2 className="text-2xl font-semibold mb-4">
          Your Posted Advertisements
        </h2>
        <button
          onClick={handleOpenAddTaskModal}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          +
        </button>
        <div className="bg-white p-6 rounded shadow overflow-auto max-h-96 mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={String(task._id)}>
                    <td className="border px-4 py-2">
                      <Link href={`/Ads/${task._id}`}>{task.title}</Link>
                    </td>
                    <td className="border px-4 py-2">{task.description}</td>
                    <td className="border px-4 py-2">{task.rating}</td>
                    <td className="border px-4 py-2">{task.category}</td>
                    <td className="border px-4 py-2">{task.duration}</td>
                    <td className="border px-4 py-2">{task.reward}</td>
                    <td className="border px-4 py-2">{task.budget}</td>
                    <td className="border px-4 py-2">
                      {new Date(task.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2" colSpan={7}>
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-lg font-semibold">Stats of Your Tasks:</h3>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">In-Progress Tasks</h2>
          <div className="bg-white p-6 rounded shadow overflow-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Completed By
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <tr key={String(task._id)}>
                      <td className="border px-4 py-2">
                        <Link href={`/Ads/${task._id}`}>{task.title}</Link>
                      </td>
                      <td className="border px-4 py-2">{task.description}</td>
                      <td className="border px-4 py-2">{task.rating}</td>
                      <td className="border px-4 py-2">{task.category}</td>
                      <td className="border px-4 py-2">
                        {new Date(task.createdAt).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {task.submissions
                          ? task.submissions.reduce(
                              (acc, submission) =>
                                acc +
                                (submission.taskDoneBy
                                  ? submission.taskDoneBy.length
                                  : 0),
                              0
                            )
                          : 0}
                      </td>
                      <td className="border px-4 py-2">
                        <Button
                          onClick={() =>
                            updateTaskStatus(String(task._id), "Completed")
                          }
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                        >
                          Mark as Completed
                        </Button>
                        <Button
                          onClick={() =>
                            updateTaskStatus(String(task._id), "Rejected")
                          }
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border px-4 py-2" colSpan={7}>
                      No in-progress tasks
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={handleCloseAddTaskModal}
          onSubmit={handleSubmitAddTask}
          createdBy={session.user.username}
        />
      </div>
    </div>
  );
};

export default CreateAdvertisement;
