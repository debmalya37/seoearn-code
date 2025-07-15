// src/components/AddTaskModal.tsx
'use client';

import React, { FC, useState, useEffect, useMemo } from 'react';
import { TaskData } from '@src/types/task';
import { useSession } from 'next-auth/react';
import { useToast } from '@src/components/ui/use-toast';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
  createdBy: string;
}

const categoryOptions = [
  "Nothing is selected",
  "Registration only",
  "Registration with activity",
  "Activity only",
  "Bonuses",
  "YouTube",
  "Instagram",
  "Vkontakte",
  "FaceBook",
  "Telegram",
  "Other social networks",
  "Review/vote",
  "Posting",
  "Copyright, rewrite",
  "Captcha",
  "Transfer of points, credits",
  "Invest",
  "Forex",
  "Games",
  "Mobile Apps",
  "Downloading files",
  "Choose a referrer on SEOSPRINT",
  "Other"
];
const PLATFORM_FEE_RATE = 0.20; // 20%

const AddTaskModal: FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit, createdBy }) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    rating: 0,
    category: '',
    duration: 0,
    createdBy: createdBy,
    createdAt: new Date().toISOString(),
    reward: 0,
    budget: 0,
    status: 'Pending',
    maxUsersCanDo: 1,
    isApproved: false,   // new field
  isRejected: false ,
  is18Plus: false,

  });

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // 1) Fetch wallet balance on mount
  useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/wallet/balance?userId=${session.user._id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        console.log(session.user);
        if (json.success) setWalletBalance(json.balance);
      })
      .catch(() => {
        toast({ title: 'Error', description: 'Could not load wallet balance', variant: 'destructive' });
      });
  }, [session, toast]);

  // compute fee, net budget and max users
  const { feeAmount, netBudget, maxUsers } = useMemo(() => {
    const gross = taskData.budget;
    const fee = parseFloat((gross * PLATFORM_FEE_RATE).toFixed(2));
    const net = parseFloat((gross - fee).toFixed(2));
    const users = taskData.reward > 0
      ? Math.max(Math.floor(net / taskData.reward), 1)
      : 1;
    return { feeAmount: fee, netBudget: net, maxUsers: users };
  }, [taskData.budget, taskData.reward]);

  // keep maxUsersCanDo in state so UI shows it
  useEffect(() => {
    setTaskData(prev => ({ ...prev, maxUsersCanDo: maxUsers }));
  }, [maxUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      // reward & budget are numbers
      [name]: ['reward','budget'].includes(name) ? Number(value) : value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskData(prev => ({ ...prev, category: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (taskData.budget > walletBalance) {
      toast({ title: 'Insufficient Funds', description: 'Your wallet balance is too low for this budget.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
               ...taskData,
               duration: Number(taskData.duration),
               reward:   Number(taskData.reward),
               budget:   Number(taskData.budget),
               is18Plus: taskData.is18Plus,
             });
      onClose();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create task', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
        {/* <span>{session?.user}</span> */}
        <p className="mb-4 text-sm text-gray-600">
          Your wallet balance: <strong>${walletBalance.toFixed(2)}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1">Description:</label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label htmlFor="rating" className="block mb-1">Rating:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={taskData.rating}
              onChange={handleChange}
              className="border p-2 w-full"
              min="0" max="5" step="0.1"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block mb-1">Category:</label>
            <select
              id="category"
              name="category"
              value={taskData.category}
              onChange={handleCategoryChange}
              className="border p-2 w-full"
              required
            >
              {categoryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

{/* is18Plus Checkbox */}
<div className="mb-4 flex items-center space-x-2">
  <input
    type="checkbox"
    id="is18Plus"
    checked={taskData.is18Plus}
    onChange={(e) =>
      setTaskData((prev) => ({ ...prev, is18Plus: e.target.checked }))
    }
  />
  <label htmlFor="is18Plus" className="text-sm">
    This task is for 18+ users only
  </label>
</div>

          {/* Duration */}
          <div className="mb-4">
            <label htmlFor="duration" className="block mb-1">Duration (hours):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={taskData.duration}
              onChange={handleChange}
              className="border p-2 w-full"
              min="0" step="0.1"
              required
            />
          </div>

          {/* --- Gross Budget --- */}
          <div className="mb-2">
            <label htmlFor="budget" className="block mb-1">Budget (gross $):</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={taskData.budget}
              onChange={handleChange}
              className="border p-2 w-full"
              min="0" step="0.01"
              required
            />
          </div>
          {/* Fee & Net Info */}
          <p className="mb-4 text-sm text-gray-500">
            Platform fee ({PLATFORM_FEE_RATE * 100}%): <strong>${feeAmount.toFixed(2)}</strong>  
            &nbsp;|&nbsp; Net budget: <strong>${netBudget.toFixed(2)}</strong>
          </p>

          {/* --- Reward --- */}
          <div className="mb-4">
            <label htmlFor="reward" className="block mb-1">Reward ($):</label>
            <input
              type="number"
              id="reward"
              name="reward"
              value={taskData.reward}
              onChange={handleChange}
              className="border p-2 w-full"
              min="0" step="0.01"
              required
            />
          </div>

          {/* --- Max Users --- */}
          <div className="mb-4">
            <label htmlFor="maxUsersCanDo" className="block mb-1">Max Users Can Do:</label>
            <input
              type="number"
              id="maxUsersCanDo"
              name="maxUsersCanDo"
              value={taskData.maxUsersCanDo}
              className="border p-2 w-full bg-gray-100"
              disabled
            />
          </div>


          {/* Actions */}
          <div className="flex items-center">
            <button
              type="submit"
              disabled={submitting || taskData.budget > walletBalance}
              className={`px-4 py-2 rounded text-white ${
                submitting || taskData.budget > walletBalance
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Creating…' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-3 px-4 py-2 text-gray-700 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
