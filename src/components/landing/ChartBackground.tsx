import React from 'react';

const ChartBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Candlestick chart pattern */}
        <g>
          {Array.from({ length: 40 }).map((_, i) => {
            const x = 30 + i * 25;
            const open = 200 + Math.random() * 100;
            const close = 200 + Math.random() * 100;
            const high = Math.max(open, close) + Math.random() * 50;
            const low = Math.min(open, close) - Math.random() * 50;
            const isUp = close > open;
            
            return (
              <g key={i}>
                {/* Wick */}
                <line 
                  x1={x} 
                  y1={high} 
                  x2={x} 
                  y2={low} 
                  stroke={isUp ? "#34A853" : "#EA4335"} 
                  strokeWidth="1"
                />
                {/* Body */}
                <rect 
                  x={x - 5} 
                  y={isUp ? open : close} 
                  width="10" 
                  height={Math.abs(open - close)} 
                  fill={isUp ? "#34A853" : "#EA4335"} 
                />
              </g>
            );
          })}
        </g>

        {/* Trend lines */}
        <path 
          d="M0,250 Q250,150 500,300 T1000,250" 
          fill="none" 
          stroke="url(#grad1)" 
          strokeWidth="2"
        />
        <path 
          d="M0,300 Q300,400 600,250 T1200,350" 
          fill="none" 
          stroke="#FFD700" 
          strokeOpacity="0.3" 
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default ChartBackground;