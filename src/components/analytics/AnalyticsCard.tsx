import React, { useState } from 'react';
import { Maximize2, Plus, X } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, content, footer }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  return (
    <div className="card rounded-lg p-4 animate-slide-up shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-gray-700 rounded-md transition-colors">
            <Plus size={16} />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded-md transition-colors">
            <Maximize2 size={16} />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded-md transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        {content}
      </div>
      
      {footer && (
        <>
          <div className="flex border-t border-gray-700 -mx-4 px-4 pt-3">
            <div className="flex space-x-2 text-xs">
              <TimeRangeButton
                active={timeRange === 'year'}
                onClick={() => setTimeRange('year')}
                label="Year"
              />
              <TimeRangeButton
                active={timeRange === 'month'}
                onClick={() => setTimeRange('month')}
                label="Month"
              />
              <TimeRangeButton
                active={timeRange === 'week'}
                onClick={() => setTimeRange('week')}
                label="Week"
              />
              <TimeRangeButton
                active={timeRange === 'day'}
                onClick={() => setTimeRange('day')}
                label="Day"
              />
            </div>
          </div>
          <div className="mt-2 text-xs">{footer}</div>
        </>
      )}
    </div>
  );
};

interface TimeRangeButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ active, onClick, label }) => {
  return (
    <button
      className={`px-3 py-1 rounded-md transition-colors duration-200 ${
        active
          ? ''
          : ''
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};