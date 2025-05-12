import React from 'react';

export const BarChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Sample data with winning percentage per month
  const winPercentages = [45, 38, 52, 40, 55, 48, 65];
  const lossPercentages = [55, 62, 48, 60, 45, 52, 35];
  
  const maxHeight = 80; // Maximum height for bars in pixels
  
  return (
    <div className="w-full h-full flex items-end">
      <div className="w-full flex items-end justify-between space-x-1">
        {months.map((month, index) => (
          <div key={month} className="flex flex-col items-center">
            <div className="w-full flex justify-center space-x-1">
              <div
                className="w-3 bg-accent-danger transition-all duration-300 ease-out rounded-sm"
                style={{ height: `${(lossPercentages[index] / 100) * maxHeight}px` }}
              />
              <div
                className="w-3 bg-accent-success transition-all duration-300 ease-out rounded-sm"
                style={{ height: `${(winPercentages[index] / 100) * maxHeight}px` }}
              />
            </div>
            <div className="text-gray-400 text-xs mt-1">{month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};