// src/app/TaskFeed/[taskId]/page.tsx

"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { ITask } from "@src/models/taskModel";
import { useToast } from "@src/components/ui/use-toast";
import { useParams } from "next/navigation";

interface Props {
  params: {
    taskId: string;
  };
}

const TaskDetails: FC<Props> = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  console.log("here is ur taskid from params ", taskId);
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/ownTask/${taskId}`);
        console.log("API response:", response);

        if (response.data.success) {
          setTask(response.data.task);
          console.log("Task set:", response.data.task);
        } else {
          console.error("API responded with an error:", response.data.message);
          toast({
            title: "Error",
            description: response.data.message || "Failed to fetch task details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch task details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId, toast]);

  if (isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="mb-2"><strong>Description:</strong> {task.description}</p>
      <p className="mb-2"><strong>Rating:</strong> {task.rating}</p>
      <p className="mb-2"><strong>Category:</strong> {task.category}</p>
      <p className="mb-2"><strong>Duration:</strong> {task.duration}</p>
      <p className="mb-2"><strong>Reward:</strong> {task.reward}</p>
      <p className="mb-2"><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default TaskDetails;
