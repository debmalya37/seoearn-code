"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@src/components/ui/use-toast";
import { ITask } from "@src/models/taskModel";
import Link from "next/link";
import AddTaskModal from "@src/components/AddTaskModal";
import { ApiResponse } from "@src/types/ApiResponse";
// import Notification from "@src/components/Notification";
import InsightDashboard from "@src/components/InsightDashboard";
import { Button } from "@src/components/ui/button";

export interface AdsTaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  reward: number;
  status?: string;
  createdAt?: string;
}

const CreateAdvertisement: FC = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [taskStats, setTaskStats] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
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
        setTasks(response.data.tasks || []);
        setTaskStats(response.data.taskPipeLine || {});
        setNotifications(response.data.notifications || []);
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
          description: axiosError.response?.data.message || "Failed to fetch tasks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setTasks, setTaskStats, setNotifications, toast]
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

  const handleSubmitAddTask = (task: AdsTaskData) => {
    // Handle adding the task (e.g., send API request, update state, etc.)
    console.log("New Task:", task);
  };

  if (!session || !session.user) {
    return <Link href="/sign-in">PLEASE LOGIN</Link>;
  }

  return (
    <div className="p-4">
      <span>Welcome to Your Advertisement Dashboard,&nbsp; {session.user.username}!</span>
      <hr className="my-4" />
      {/* <di className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        {/* <di className="col-span-1"> */}
          <h2 className="text-2xl font-semibold mb-4">Your Posted Advertisements</h2>
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
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={String(task._id)}> {/* Convert _id to string */}
                      <td className="border px-4 py-2">
                        <Link href={`/Ads/${task._id}`}>
                          {task.title}
                        </Link>
                      </td>
                      <td className="border px-4 py-2">{task.description}</td>
                      <td className="border px-4 py-2">{task.rating}</td>
                      <td className="border px-4 py-2">{task.category}</td>
                      <td className="border px-4 py-2">{task.duration}</td>
                      <td className="border px-4 py-2">{task.reward}</td>
                      <td className="border px-4 py-2">{new Date(task.createdAt).toLocaleString()}</td>
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
        {/* </di> */}

      {/* </di> */}
      <h3 className="mt-8 text-lg font-semibold">Stats of Your Tasks:</h3>
      <div className="col-span-1">
        <Button
        onClick={handleToggleDashboard}
        className="p-2 bg-blue-500 text-white rounded shadow"
      >
        {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
      </Button>

      {showDashboard && <InsightDashboard />}
          {/* <InsightDashboard insights={taskStats} /> */}
          {/* <Notification notifications={notifications} /> */}
        </div>
      <div className="flex justify-between items-center mt-4 pb-6">
        <div>
          <p>Total Clicks: {taskStats?.clicks?.totalClicks || 0}</p>
          <p>Total Female Clicks: {taskStats?.clicks?.totalFemaleClicks || 0}</p>
          <p>Total Male Clicks: {taskStats?.clicks?.totalMaleClicks || 0}</p>
          <p>Average Age of Clickers: {taskStats?.clicks?.avgAge || 0}</p>
        </div>
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
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={handleCloseAddTaskModal}
        onSubmit={handleSubmitAddTask}
        createdBy={session?.user.email}
      />
    </div>
  );
};

export default CreateAdvertisement;

