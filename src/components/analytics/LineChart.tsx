import React from 'react';

export const LineChart: React.FC = () => {
  // Sample data points for two lines (winning percentage over time)
  const months = ['January', 'February', 'March', 'April', 'May'];
  
  // Line 1 data (current period)
  const currentData = [55, 40, 65, 50, 60];
  
  // Line 2 data (previous period)
  const previousData = [65, 70, 45, 50, 40];
  
  // Chart dimensions
  const height = 120;
  const width = 300;
  const padding = 20;
  
  // Calculate chart area
  const chartHeight = height - 2 * padding;
  const chartWidth = width - 2 * padding;
  
  // Find data range
  const maxValue = Math.max(...currentData, ...previousData);
  const minValue = Math.min(...currentData, ...previousData);
  const valueRange = maxValue - minValue;
  
  // Calculate points for the paths
  const getPoints = (data: number[]) => {
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding;
      const y = height - ((value - minValue) / valueRange) * chartHeight - padding;
      return `${x},${y}`;
    }).join(' ');
  };
  
  // Create SVG paths
  const currentPath = `M ${getPoints(currentData)}`;
  const previousPath = `M ${getPoints(previousData)}`;
  
  return (
    <div className="w-full h-full flex items-center justify-center text-xs">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines (horizontal) */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = height - (percent / 100) * chartHeight - padding;
          return (
            <g key={percent}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#333"
                strokeWidth="1"
                strokeDasharray={percent % 50 === 0 ? "" : "4,4"}
              />
              <text
                x={padding - 5}
                y={y + 4}
                textAnchor="end"
                fill="#6B7280"
                fontSize="10"
              >
                {percent}%
              </text>
            </g>
          );
        })}
        
        {/* Current period line */}
        <path
          d={currentPath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Previous period line */}
        <path
          d={previousPath}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4,4"
        />
        
        {/* Data points for current period */}
        {currentData.map((value, index) => {
          const x = (index / (currentData.length - 1)) * chartWidth + padding;
          const y = height - ((value - minValue) / valueRange) * chartHeight - padding;
          return (
            <circle
              key={`current-${index}`}
              cx={x}
              cy={y}
              r="3"
              fill="#10B981"
            />
          );
        })}
      </svg>
    </div>
  );
};