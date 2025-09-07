
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-gray-400">{description}</p>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
