import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Trade {
  id: number;
  date: Date;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  strategy: string;
  notes: string;
}

interface EntryProps {
  entry: Trade;
}

export const Entry: React.FC<EntryProps> = ({ entry }) => {
  const [expanded, setExpanded] = React.useState(false);

  const isLong = entry.direction === 'LONG';
  const pipMultiplier = 10000;

  const pips = isLong
    ? (entry.exitPrice - entry.entryPrice) * pipMultiplier
    : (entry.entryPrice - entry.exitPrice) * pipMultiplier;

  const profit = isLong
    ? entry.exitPrice - entry.entryPrice
    : entry.entryPrice - entry.exitPrice;

  const isWin = profit > 0;
  const resultLabel = isWin ? 'WIN' : 'LOSS';
  const resultColorClass = isWin
    ? 'bg-accent-success/20 text-accent-success'
    : 'bg-accent-danger/20 text-accent-danger';

  const directionIcon = isLong ? (
    <ChevronUp className="text-accent-success" size={16} />
  ) : (
    <ChevronDown className="text-accent-danger" size={16} />
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="card rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col w-full">
            <div className="w-full flex items-center justify-between">
              <span className="text-sm text-black/40 dark:text-white/40">{formatDate(entry.date)}</span>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-black/40 dark:text-white/40 hover:text-white p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ChevronDown className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} size={18} />
              </button>
            </div>
            <div className="flex items-center mt-1">
              <div className="flex items-center mr-2">
                {directionIcon}
                <span className="font-medium ml-1">{entry.symbol}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${resultColorClass}`}>
                {resultLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between space-x-8">
          <div className="flex flex-col items-start">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-black/40 dark:text-white/40">Entry</span>
              <span className="text-xs font-medium text-[20px]">{entry.entryPrice}</span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-black/40 dark:text-white/40">Exit</span>
              <span className="text-xs font-medium">{entry.exitPrice}</span>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-black/40 dark:text-white/40">Pips</span>
              <span className={`text-xs font-medium ${profit >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                {pips > 0 ? '+' : ''}{pips.toFixed(1)}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-black/40 dark:text-white/40">P/L</span>
              <span className={`text-xs font-medium ${profit >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                {profit > 0 ? '+' : ''}{formatCurrency(profit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-gray-700 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Strategy</h4>
              <p>{entry.strategy}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Notes</h4>
              <p className="text-sm text-black/40 dark:text-white/40">{entry.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};