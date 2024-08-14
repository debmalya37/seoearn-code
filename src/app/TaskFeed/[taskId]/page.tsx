"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { ITask } from "@src/models/taskModel";
import { useToast } from "@src/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Button } from "@src/components/ui/button";

const TaskDetails: FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    status: "In Progress",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/tasks/${taskId}`);
        if (response.data.success) {
          setTask(response.data.task);
          setFormState({
            status: "In Progress",
          });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {
        status: formState.status,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
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
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Created By:</strong> {task.createdBy}</p>
        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <p><strong>Duration:</strong> {task.duration}</p>
        <p><strong>Reward:</strong> {task.reward}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Max users can do:</strong> {task.maxUsersCanDo}</p>
        <p><strong>Rating:</strong> {task.rating}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Submit Task
        </Button>
      </form>
    </div>
  );
};

export default TaskDetails;


      // formData.append('rating', formState.rating);
      // formData.append('description', formState.description);

// formData.append('notes', formState.notes);
// if (formState.file) {
//   formData.append('file', formState.file);
// }

{/* <Button onClick={handleStatusChange} className="mt-4 bg-green-500 text-white py-2 px-4 rounded">
Submit Task
</Button> */}
// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
    //     if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 250 * 1024) {
      //       toast({
        //         title: "Invalid file",
        //         description: "File must be PNG, JPG, or JPEG and less than 250KB",
        //         variant: "destructive",
  //       });
  //       return;
  //     }
  //     setFormState({ ...formState, file });
  //   }
  // };
  {/* <div>
    <label className="block text-gray-700">Additional Notes</label>
    <Textarea
    name="notes"
    value={formState.notes}
    onChange={handleChange}
    className="mt-1 block w-full"
    />
  </div> */}
      {/* <div>
        <label className="block text-gray-700">Description</label>
        <Textarea
        name="description"
        value={formState.description}
        onChange={handleChange}
        className="mt-1 block w-full"
        />
      </div> */}
      {/* <div>
        <label className="block text-gray-700">Rating</label>
        <Input
        type="number"
        name="rating"
        value={formState.rating}
        onChange={handleChange}
        className="mt-1 block w-full"
        />
        </div>
        <div>
        <label className="block text-gray-700">Status</label>
        <Select value={formState.status} onValueChange={handleStatusChange}>
        <SelectTrigger>
        <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
        <SelectGroup>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Approved">Approved</SelectItem>
        </SelectGroup>
        </SelectContent>
        </Select>
      </div> */}
  {/* <div>
    <label className="block text-gray-700">Upload File</label>
    <Input
      type="file"
      accept=".png, .jpg, .jpeg"
      onChange={handleFileChange}
      className="mt-1 block w-full"
      />
    </div> */}