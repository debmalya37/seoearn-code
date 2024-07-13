"use client";

import React from 'react'
import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import { TaskData } from '@src/app/TaskFeed/page';
import mongoose from 'mongoose';
import axios from 'axios';
import { ApiResponse } from '@src/types/ApiResponse';

interface TaskDetailsPageData {
    id: string,
    status: string;
    title: string;
    description: string;
    rating: number;
    category: string;
    duration: number;
    createdBy: mongoose.Types.ObjectId; // Adjusted to ObjectId
    reward: number;
    createdAt: Date;

  }


const TaskDetailsPage: React.FC<TaskDetailsPageData> = ( {params}: any) => {
    const id = params.id;
    const fetchTaskDetails = async () => {

        const res = await fetch(`/api/${id}`);
        const data =  res.json;
        return <div>here is the data id</div> ;
        
    }

    // const params = useParams()
    // const searchParams = useSearchParams();
    // const taskId = searchParams.get("id");

    // console.log("here is the param",params);
    // console.log("here is the task ",task);
    // console.log(searchParams);
    fetchTaskDetails();

  return (
    <>
    here is the task data {id};
    </>
    //   task ID and details page
    //   your taskId {params.id};






    // <span>name :</span>


);
};


export default TaskDetailsPage;