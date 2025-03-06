"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { ITask } from "@src/models/taskModel";
import { useToast } from "@src/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { Textarea } from "@src/components/ui/Textarea";
import { Input } from "@src/components/ui/input";
import { useSession } from "next-auth/react";

const TaskDetails: FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  // Initialize form state with a default status if needed.
  const [formState, setFormState] = useState({
    status: "Completed",
    notes: "",
    fileUrl: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/tasks/${taskId}`);
        if (response.data.success) {
          setTask(response.data.task);
          // Optionally, set form state based on the fetched task
        } else {
          toast({
            title: "Error",
            description:
              response.data.message || "Failed to fetch task details",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // When the submit button is clicked, the PUT endpoint is called.
      // The API will update the task and add the logged-in user (based on session) to taskDoneBy.
      const response = await axios.put(
        `/api/tasks/${taskId}`,
        {
          status: formState.status,
          notes: formState.notes,
          fileUrl: formState.fileUrl,
          // If needed, you can include additional fields here.
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
          description:
            response.data.message || "Failed to update task details",
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
        <p>
          <strong>Title:</strong> {task.title}
        </p>
        <p>
          <strong>Description:</strong> {task.description}
        </p>
        <p>
          <strong>Additional Notes:</strong> {task.notes}
        </p>
        <p>
          <strong>Category:</strong> {task.category}
        </p>
        <p>
          <strong>Created By:</strong> {task.createdBy}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(task.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Duration:</strong> {task.duration}
        </p>
        <p>
          <strong>Reward:</strong> {task.reward}
        </p>
        <p>
          <strong>Status:</strong> {task.status}
        </p>
        <p>
          <strong>Rating:</strong> {task.rating}
        </p>
      </div>
      <div>
        <label className="block text-gray-700">Additional Notes</label>
        <Textarea
          name="notes"
          value={formState.notes}
          onChange={(e) =>
            setFormState({ ...formState, notes: e.target.value })
          }
          className="mt-1 block w-full"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Submit Task
        </Button>
      </form>
    </div>
  );
};

export default TaskDetails;
