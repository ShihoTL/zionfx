import React, { useState } from 'react';
import { AnalyticsGrid } from '@/components/analytics/AnalyticsGrid';
import { JournalEntries } from '@/components/journal/JournalEntries';
import { BarChart2, BookOpen } from 'lucide-react';
import AddEntryModal from '@/components/journal/AddEntryModal';

const Journal: React.FC = () => {
  const [tab, setTab] = useState<'analytics' | 'journal'>('journal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-6 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6 pb-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {/* Show current tab on mobile; fixed title on larger screens */}
              <span className="md:hidden">
                {tab === 'analytics' ? 'Analytics' : 'Journal'}
              </span>
              <span className="hidden md:inline">Journal & Analytics</span>
            </h1>

            {/* Show only on journal tab and only on mobile */}
            {tab === 'journal' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full md:hidden"
              >
                New Entry
              </button>
            )}
          </div>

          {/* Mobile: conditional rendering based on selected tab */}
          <div className="block md:hidden">
            {tab === 'analytics' ? <AnalyticsGrid /> : <JournalEntries />}
          </div>

          {/* Desktop/Tablet: show both side by side */}
          <div className="hidden md:block space-y-6">
            <AnalyticsGrid />
            <div className="">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Journal</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-full"
                >
                  New Entry
                </button>
              </div>
              <JournalEntries />
            </div>
            
          </div>
        </div>
      </div>

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Bottom Navigation - visible only on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-dark-1/10 dark:border-light-1/10 md:hidden z-20">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setTab('journal')}
            className={`flex flex-col items-center text-xs ${
              tab === 'journal' ? 'text-yellow-500' : 'text-gray-500'
            }`}
          >
            <BookOpen className="h-5 w-5 mb-1" />
            Journal
          </button>

          <button
            onClick={() => setTab('analytics')}
            className={`flex flex-col items-center text-xs ${
              tab === 'analytics' ? 'text-yellow-500' : 'text-gray-500'
            }`}
          >
            <BarChart2 className="h-5 w-5 mb-1" />
            Analytics
          </button>
        </div>
      </nav>
    </main>
  );
};

export default Journal;