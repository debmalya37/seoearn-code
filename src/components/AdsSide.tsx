// src/components/AdsSide.tsx
'use client';

import React from 'react';
import { FaPlus, FaChartLine, FaEye, FaUsers } from 'react-icons/fa';
import { Button } from '@src/components/ui/button';

export interface AdsSideProps {
  onOpenNewTask: () => void;
  onShowPerformance: () => void;
  onShowViews: () => void;
  onShowInteractions: () => void;
}

const AdsSide: React.FC<AdsSideProps> = ({
  onOpenNewTask,
  onShowPerformance,
  onShowViews,
  onShowInteractions,
}) => (
  <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
    {/* Logo / Brand */}
    <div className="p-6 text-center border-b">
      <h2 className="text-2xl font-bold text-blue-600">AdMaster</h2>
    </div>

    {/* KPIs */}
    <div className="p-4 space-y-4">
      <div className="bg-blue-50 p-3 rounded">
        <h4 className="text-xs text-gray-500">Balance</h4>
        <p className="text-xl font-semibold">$1,230.00</p>
      </div>
      <div className="bg-green-50 p-3 rounded">
        <h4 className="text-xs text-gray-500">Total Spent</h4>
        <p className="text-xl font-semibold">$8,450.00</p>
      </div>
      <div className="bg-yellow-50 p-3 rounded">
        <h4 className="text-xs text-gray-500">Active Ads</h4>
        <p className="text-xl font-semibold">12</p>
      </div>
    </div>

    {/* Actions */}
    <div className="p-4">
      <Button
        onClick={onOpenNewTask}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white"
      >
        <FaPlus />
        <span>New Ad</span>
      </Button>
    </div>

    {/* Navigation */}
    <nav className="mt-4 flex-1 px-4 space-y-2 text-gray-700">
      <button
        onClick={onShowPerformance}
        className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-200"
      >
        <FaChartLine className="text-lg" />
        <span className="ml-2">Performance</span>
      </button>

      <button
        onClick={onShowViews}
        className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-200"
      >
        <FaEye className="text-lg" />
        <span className="ml-2">Top Views</span>
      </button>

      <button
        onClick={onShowInteractions}
        className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-200"
      >
        <FaUsers className="text-lg" />
        <span className="ml-2">Interactions</span>
      </button>
    </nav>

    {/* Optional Footer */}
    <div className="p-4 text-xs text-gray-400 border-t">
      © 2025 AdMaster Inc.
    </div>
  </aside>
);

export default AdsSide;
