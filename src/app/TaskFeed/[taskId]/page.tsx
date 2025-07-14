// src/app/taskfeed/[taskId]/page.tsx
'use client';

import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { IRequest, ITask } from '@src/models/taskModel';
import { useToast } from '@src/components/ui/use-toast';
import { useParams } from 'next/navigation';
import { Button } from '@src/components/ui/button';
import { Textarea } from '@src/components/ui/Textarea';
import { Input } from '@src/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@src/components/ui/select';
import { useSession } from 'next-auth/react';

const TaskDetailsPage: FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [formState, setFormState] = useState({
    status: 'Completed',
    notes: '',
    fileUrl: '',
  });
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<{
    _id: string;
    userId: { username: string; email: string };
    message?: string;
    fileUrl?: string;
    status: string;
    createdAt: string;
  }[]>([]);
  

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/tasks/${taskId}`);
        if (response.data.success) {
          setTask(response.data.task);
          const { data: reqData } = await axios.get(`/api/tasks/${taskId}/requests`);
          if (reqData.success) setSubmissions(reqData.requests);
          setFormState((prev) => ({
            ...prev,
            status: response.data.task.status || 'Completed',
            notes: response.data.task.notes || '',
            fileUrl: response.data.task.fileUrl || '',
          }));
        } else {
          toast({
            title: 'Error',
            description: response.data.message || 'Failed to fetch task details',
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to fetch task details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSubmissions = async () => {
      const { data } = await axios.get(`/api/tasks/${taskId}/requests`);
      if (data.success) setSubmissions(data.requests);
    };
    

    if (taskId) {
      fetchTask();
      fetchSubmissions();
    }
  }, [taskId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {

    const fetchSubmissions = async () => {
      const { data } = await axios.get(`/api/tasks/${taskId}/requests`);
      if (data.success) setSubmissions(data.requests);
    };
    
    e.preventDefault();
    try {
      // 1️⃣ post a new submission
      const { data } = await axios.post<{ success: boolean; requests: IRequest[] }>(
        `/api/tasks/${taskId}/requests`,
        {
          message: formState.notes,
          fileUrl: formState.fileUrl,
        }
      );
      
      if (data.success) {
        toast({ title: 'Submitted', description: 'Your request is pending.' });
        setFormState({ notes:'', fileUrl:'', status: formState.status });
        await fetchSubmissions();
      }
      // 2️⃣ re-fetch submissions
      const { data: reqData } = await axios.get(`/api/tasks/${taskId}/requests`);
      if (reqData.success) setSubmissions(reqData.requests);
  
      toast({ title: 'Submitted', description: 'Your work has been sent for review.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Submission failed', variant: 'destructive' });
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-700 dark:text-gray-300">Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <h1 className="text-3xl font-extrabold text-white">{task.title}</h1>
          <p className="mt-1 text-indigo-100">{new Date(task.createdAt).toLocaleString()}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Task Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Description</h2>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{task.description}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Category</h2>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 rounded-full">
                  {task.category}
                </span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Created By</h2>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{task.createdBy}</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Status</h2>
                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    task.status === 'Approved'
                      ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200'
                      : task.status === 'Rejected'
                      ? 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-200'
                      : task.status === 'In Progress'
                      ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200'
                      : task.status === 'Completed'
                      ? 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {task.status || 'Pending'}
                </span>
              </div> */}
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Reward</h2>
                <p className="mt-1 text-gray-800 dark:text-gray-200">${task.reward.toFixed(2)}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Duration</h2>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{task.duration} minutes</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Rating</h2>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{task.rating}/5</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Submit Your Work</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Status Dropdown */}
              {/* <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <Select onValueChange={(val) => setFormState((prev) => ({ ...prev, status: val }))}>
                  <SelectTrigger id="status" className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div> */}

              {/* File URL Input */}
              <div>
                <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File URL</label>
                <Input
                  id="fileUrl"
                  type="url"
                  name="fileUrl"
                  placeholder="https://example.com/your-file"
                  value={formState.fileUrl}
                  onChange={(e) => setFormState((prev) => ({ ...prev, fileUrl: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Notes Textarea */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Notes</label>
              <Textarea
                id="notes"
                name="notes"
                value={formState.notes}
                onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows={4}
                placeholder="Enter any additional details..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                Submit Task
              </Button>
            </div>
          </form>

          <div className="mt-8">
  <h3 className="text-xl font-semibold">Your Submissions</h3>
  {submissions.length === 0 ? (
    <p className="text-gray-500">No submissions yet.</p>
  ) : (
    <ul className="space-y-4">
      {submissions.map((s) => (
        <li key={s._id} className="border p-4 rounded">
          <p>
            <strong>Status:</strong> {s.status} &nbsp;
            <span className="text-xs text-gray-400">
              ({new Date(s.createdAt).toLocaleString()})
            </span>
          </p>
          {s.message && <p><strong>Note:</strong> {s.message}</p>}
          {s.fileUrl && (
            <p>
              <strong>File: </strong>
              <a href={s.fileUrl} target="_blank" className="text-blue-600 underline">
                View
              </a>
            </p>
          )}
        </li>
      ))}
    </ul>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
