"use client";
import React, { FC, useCallback, useEffect, useState } from 'react';
import TaskCard from '@/components/TaskCard';
import TaskDetails from '@/components/TaskDetails';
import AddTaskModal from '@/components/AddTaskModal';
import Nav from '@/components/Nav';
import { ITask, TaskSchema } from '@/models/taskModel';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/schemas/TaskSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Description } from '@radix-ui/react-toast';
import Link from 'next/link';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';



export interface TaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string;
  reward: number;
  status: string;
  createdAt: string;
}


const TasksPage = () => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const handleDeleteMessage = (taskId: string) => {
    setTasks(tasks.filter((task) => task._id !== taskId))
  }
  const {data: session} = useSession()
  const form = useForm({
    resolver: zodResolver(taskSchema)
  })

  const {register, watch, setValue } = form;
// fetchTasks 
  const fetchTasks = useCallback(async (refresh: boolean)=> {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/tasks')
      setTasks(response.data.tasks || [])
      if (refresh) {
        toast({
          title: "Refresh Messages",
          description: "showing latest Tasks"
          
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
          description: axiosError.response?.data. message|| "failed to fetch message settings",
          variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setTasks, toast]);


  useEffect(()=> {
    if(!session || !session.user) return
    fetchTasks(true)
    
  }, [session, setValue, fetchTasks])





  const handleTaskClick = (task: TaskData) => {
    setSelectedTask(task);
  };

  const handleOpenAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleSubmitAddTask = (task: TaskData) => {
    // Handle adding the task (e.g., send API request, update state, etc.)
    console.log('New Task:', task);
  };


  // const {username} = session?.user as User
  // todo research on baseurl and url making
  // const baseUrl = `${window.location.protocol}// ${window.location.host}`
  // const profileUrl = `${baseUrl}/u/${username}`;
  // const copyToClipboard = ()=> {
  //   navigator.clipboard.writeText(profileUrl)
  //   toast({
  //     title: "URL copied",
  //     description: "Profile URL has been copied to clipboard" 
  //   })
  // }
  if(!session || !session.user ) {
    return <Link href={'/sign-in'}>  PLEASE LOGIN</Link>

  }
  return (
    <>
      {/* <div className='flex justify-between w-full items-center'> */}

      <Nav/>
        {/* </div> */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 bg-yellow-100 p-4 flex flex-col justify-between ">
          <div className='fixed'>
            <div className="text-xl font-bold mb-6">Username</div>
            <nav className="space-y-4">
              <a href="#" className="block">Advertisement</a>
              <a href="#" className="block">Income</a>
              <a href="#" className="block">Referral</a>
              <a href="#" className="block">Task</a>
              <a href="#" className="block">Payment</a>
              <a href="#" className="block">Contact & Support</a>
              <a href="#" className="block">Status</a>
              <a href="#" className="block">About Us</a>
            </nav>
          <button className="bg-orange-400 text-white py-2 px-4 rounded-md">Sign Out</button>
          </div>
        </div>
        {/* <h2 className="text-lg font-semibold mb-2">Copy Your Profile Link</h2>
        {" "}
        <div className="flex items-center">
          <input 
          type="text" 
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div> */}
        {/* Task List */}
        <div className="w-3/5 bg-purple-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <input type="text" placeholder="search" className="border rounded-md py-2 px-4" />
          </div>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task)=> {
                <TaskCard
                key={task._id}
                task={task}
                />
              })
            ) : (
              
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
          createdBy=""
        />
      </div>
    </>
  );
};

export default TasksPage;
