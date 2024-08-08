import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InsightsData } from '../types/InsightDashboardTypes'; // Adjust the import path as needed

const InsightDashboard: React.FC = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get<InsightsData>('/api/insights');
        setInsights(response.data);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!insights) return <p>No data available</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Insight Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded">
          <h4 className="text-lg font-semibold">Total Tasks</h4>
          <p>{insights.taskStats.totalTasks}</p>
        </div>
        <div className="p-4 border rounded">
          <h4 className="text-lg font-semibold">Total Earnings</h4>
          <p>${insights.taskStats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded">
          <h4 className="text-lg font-semibold">Total Deposits</h4>
          <p>${insights.taskStats.totalDeposits.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded">
          <h4 className="text-lg font-semibold">Total Withdrawals</h4>
          <p>${insights.taskStats.totalWithdrawals.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightDashboard;
