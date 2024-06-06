import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, onClick }) => {
  return (
    <div className="bg-white p-4 rounded shadow cursor-pointer" onClick={onClick}>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
