import React, { useState, useEffect } from 'react';
import { AnalyticsCard } from './AnalyticsCard';
import { CircularProgress } from './CircularProgress';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useJournal, JournalEntry } from "@/hooks/useJournal";
import { useUser } from "@clerk/clerk-react";

export const AnalyticsGrid: React.FC = () => {
  const { getAllEntries } = useJournal();
  const { user } = useUser();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user?.id) {
        setLoading(true);
        const data = await getAllEntries(user.id);
        setEntries(data);
        setLoading(false);
      }
    };
    fetchEntries();
  }, [user?.id, getAllEntries]);

  const isWinningTrade = (entry: JournalEntry): boolean => {
    if (entry.direction === 'LONG') return entry.exitPrice > entry.entryPrice;
    if (entry.direction === 'SHORT') return entry.exitPrice < entry.entryPrice;
    return false;
  };

  const totalTrades = entries.length;
  const winningTrades = entries.filter(isWinningTrade);
  const losingTrades = entries.filter((e) => !isWinningTrade(e));
  const winRatio = totalTrades ? Math.round((winningTrades.length / totalTrades) * 100) : 0;

  const totalProfit = entries.reduce((acc, entry) => {
    const profit =
      entry.direction === 'LONG'
        ? entry.exitPrice - entry.entryPrice
        : entry.entryPrice - entry.exitPrice;
    return acc + profit;
  }, 0);

  const profitFactor = losingTrades.length
    ? Math.abs(
        winningTrades.reduce((sum, e) => {
          const p = e.direction === 'LONG' ? e.exitPrice - e.entryPrice : e.entryPrice - e.exitPrice;
          return sum + p;
        }, 0) /
          losingTrades.reduce((sum, e) => {
            const l = e.direction === 'LONG' ? e.entryPrice - e.exitPrice : e.exitPrice - e.entryPrice;
            return sum + Math.abs(l);
          }, 0)
      )
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnalyticsCard
        title="Win ratio"
        content={
          <div className="flex items-center">
            <CircularProgress value={winRatio} size={120} />
            <div className="ml-4 space-y-1">
              <div className="text-sm text-gray-400">Winning trades</div>
              <div className="text-2xl font-semibold">{winningTrades.length}</div>
              <div className="text-sm text-gray-400">Losing trades</div>
              <div className="text-2xl font-semibold">{losingTrades.length}</div>
            </div>
          </div>
        }
        footer={
          <div className="text-xs text-gray-400">
            Your win rate is <span className="text-accent-success">{winRatio}%</span> over{" "}
            <span className="text-gray-300">{totalTrades}</span> trades
          </div>
        }
      />

      <AnalyticsCard
        title="Monthly Performance"
        content={<div className="h-[140px]"><BarChart /></div>}
        footer={<div className="text-xs text-gray-400">Trade performance over the month</div>}
      />

      <AnalyticsCard
        title="Equity Curve"
        content={<div className="h-[140px]"><LineChart /></div>}
        footer={<div className="text-xs text-gray-400">Equity trend this month</div>}
      />

      <AnalyticsCard
        title="Net Profit"
        content={
          <div className="py-2">
            <div className="flex items-center">
              <div className="text-3xl font-bold">${totalProfit.toFixed(2)}</div>
              <div className={`ml-2 flex items-center ${totalProfit >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                {totalProfit >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="text-sm">{Math.abs((totalProfit / 10000) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-1">Estimated gain compared to baseline</div>
          </div>
        }
      />

      <AnalyticsCard
        title="Profit Factor"
        content={
          <div className="py-2">
            <div className="flex items-center">
              <div className="text-3xl font-bold">{profitFactor.toFixed(2)}</div>
              <div className="ml-2 flex items-center text-accent-success">
                <ArrowUp size={16} />
                <span className="text-sm">+{(profitFactor * 10).toFixed(0)}%</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-1">Compared to last period</div>
          </div>
        }
      />

      <AnalyticsCard
        title="Total Trades"
        content={
          <div className="py-2">
            <div className="flex items-center">
              <div className="text-3xl font-bold">{totalTrades}</div>
              <div className="ml-2 flex items-center text-accent-success">
                <ArrowUp size={16} />
                <span className="text-sm">+8%</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-1">Total trades this month</div>
          </div>
        }
      />
    </div>
  );
};