import React from 'react';

interface CardProps {
    title: string;
    value: string | number;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
    return (
        <div className="p-4 bg-white shadow rounded">
            <div className="text-gray-600">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
};

export default Card;
