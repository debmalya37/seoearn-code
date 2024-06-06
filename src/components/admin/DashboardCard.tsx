import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, onClick }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer shadow-md hover:shadow-lg" onClick={onClick}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
