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
import { TaskData } from "../TaskFeed/page";
import React from "react"
import Nav from "@/components/Nav"
import AddTaskModal from "@/components/AddTaskModal"
import { useState } from "react";
const CreateAdvertisement = ()=> {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);


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


  return (
    <>
    <Nav/>
    
    <h2>YOUR POSTED ADVERTISEMENTS ARE SHOWN BELOW: </h2>
    <button onClick={handleOpenAddTaskModal}  className="fixed top-15 right-5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        + </button>


        <AddTaskModal isOpen={isAddTaskModalOpen} onClose={handleCloseAddTaskModal} onSubmit={handleSubmitAddTask} createdBy="" />
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
  
    </>
  )
}

export default CreateAdvertisement;