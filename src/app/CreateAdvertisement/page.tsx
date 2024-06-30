// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
"use client";
import TaskCard from "@/components/TaskCard";

import React, { FC, useCallback, useEffect } from "react"
import Nav from "@/components/Nav"
import AddTaskModal from "@/components/AddTaskModal"
import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/schemas/TaskSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { ITask } from "@/models/taskModel";
import Link from "next/link";

export interface AdsTaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  reward: number;
  status: string;
  createdAt: string;
}

const CreateAdvertisement: FC  = ()=> {
  const [selectedTask, setSelectedTask] = useState<AdsTaskData | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();


  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(taskSchema),
  });

  const { register, watch, setValue } = form;

  const fetchAdsTask = useCallback(
    async (refresh: boolean)=> {
      setIsLoading(true);

      try {
        const session = await getSession();
        console.log("Access Token: ", session?.accessToken);
        const response = await axios.get<ApiResponse>("api/ownTask", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,

          },
        });
        setTasks(response.data.tasks || []);
        if (refresh) {
          toast({
            title: "Refresh Tasks",
            description: "Showing latest tasks",
          })
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
    )

    useEffect(() => {
      if (!session || !session.user) return;
      fetchAdsTask(true);
    }, [session, setValue, fetchAdsTask]);


    const handleTaskClick = (task: TaskData) => {
      setSelectedTask(task);
    };
  const handleOpenAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleSubmitAddTask = (task: AdsTaskData) => {
    // Handle adding the task (e.g., send API request, update state, etc.)
    console.log('New Task:', task);
  };

  if (!session || !session.user) {
    return <Link href="/sign-in">PLEASE LOGIN</Link>;
  }

  return (
    <>
    <div className="">

    <span>Welcome to Your Advertisement Dashboard,&nbsp; {session.user.username}!</span>
    <hr />
    <h2>YOUR POSTED ADVERTISEMENTS ARE SHOWN BELOW: </h2>
    <button onClick={handleOpenAddTaskModal}  className="fixed top-15 right-5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        + 
    </button>
    {/* all ads by the user  */}
    <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  {...task}
                  onClick={handleTaskClick}
                />
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

        <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={handleCloseAddTaskModal} 
        onSubmit={handleSubmitAddTask} 
        createdBy={session?.user.email} 
        />
     {/* <Card className="w-[350px]">
    //   <CardHeader>
    //     <CardTitle>Create task</CardTitle>
    //     <CardDescription>Upload a new task</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <form>
    //       <div className="grid w-full items-center gap-4">
    //         <div className="flex flex-col space-y-1.5">
    //           <Label htmlFor="name">Name</Label>
    //           <Input id="name" placeholder="Name of your task" />
    //         </div>
    //         <div className="flex flex-col space-y-1.5">
    //           <Label htmlFor="Category">Category</Label>
    //           <Select>
    //             <SelectTrigger id="framework">
    //               <SelectValue placeholder="Select" />
    //             </SelectTrigger>
    //             <SelectContent position="popper">
    //               <SelectItem value="next">Next.js</SelectItem>
    //               <SelectItem value="sveltekit">SvelteKit</SelectItem>
    //               <SelectItem value="astro">Astro</SelectItem>
    //               <SelectItem value="nuxt">Nuxt.js</SelectItem>
    //             </SelectContent>
    //           </Select>
    //         </div>
    //       </div>
    //     </form>
    //   </CardContent>
    //   <CardFooter className="flex justify-between">
    //     <Button variant="outline">Cancel</Button>
    //     <Button>Submit</Button>
    //   </CardFooter>
    </Card> */}
    </div>
  </>
  )
}

export default CreateAdvertisement;