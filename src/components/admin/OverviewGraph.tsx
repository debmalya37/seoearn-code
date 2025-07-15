// src/components/admin/OverviewGraph.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Point {
  label: string; // e.g. "2025-07"
  value: number;
}

export default function OverviewGraph() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/revenue-by-month')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setPoints(json.data);
        } else {
          console.error('Unexpected response', json);
        }
      })
      .catch((err) => console.error('Failed to load revenue data', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading chart…</p>;
  }

  const labels = points.map((p) => p.label);
  const dataValues = points.map((p) => p.value);

  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',   // you can customize
        borderColor: 'rgba(75, 192, 192, 1)',         // you can customize
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue by Month',
        font: { size: 18 },
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (USD)',
        },
        ticks: {
          callback: (v) => `$${Number(v).toLocaleString()}`,
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <Bar data={data} options={options} />
    </div>
  );
}
