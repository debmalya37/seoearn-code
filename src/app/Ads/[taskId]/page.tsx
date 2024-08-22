"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { ITask } from "@src/models/taskModel";
import { useToast } from "@src/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/@/components/ui/textarea";

const OwnTaskDetails: FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<ITask | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/ownTask/${taskId}`);
        if (response.data.success) {
          setTask(response.data.task);
          setDescription(response.data.task.description || "");
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to fetch task details",
            variant: "destructive",
          });
        }
      } catch (error) {
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/ownTask/${taskId}`, {
        description,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Task updated successfully",
          variant: "default",
        });
        setTask(response.data.task);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update task details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task details",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Task Details</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Additional Notes:</strong> {task.notes || "N/A"}</p>
        <p><strong>File Uploaded:</strong> {task.fileUrl || "N/A"}</p> 
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Created By:</strong> {task.createdBy}</p>
        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <p><strong>Duration:</strong> {task.duration}</p>
        <p><strong>Reward:</strong> {task.reward}</p>
        <p><strong>Total Ad Budget:</strong> {task.budget || task.reward}</p>
        <p><strong>Max users can do:</strong> {task.maxUsersCanDo}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Rating:</strong> {task.rating}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            className="mt-1 block w-full"
          />
        </div>
        <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Update Task
        </Button>
      </form>
    </div>
  );
};

export default OwnTaskDetails;
