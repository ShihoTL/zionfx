import React, { useEffect, useState } from "react";
import { useJournal, JournalEntry } from "@/hooks/useJournal";
import { useUser } from "@clerk/clerk-react";
import { Entry } from "./Entry";

export const JournalEntries: React.FC = () => {
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

  if (loading) {
    return (
      <div className="h-full flex flex-col justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500" />
        <span className="ml-3 text-gray-400 text-sm">Loading your trades...</span>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-400 flex flex-col items-center space-y-2">
        <span className="text-lg font-medium">No trades yet</span>
        <p className="text-sm text-gray-500">Start by logging your first journal entry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  );
};