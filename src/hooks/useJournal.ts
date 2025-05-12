import { useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export interface CreateJournalEntryInput {
  userId: string;
  symbol: string;
  tradeDate: string;
  direction: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  strategy?: string;
  notes?: string;
}

export interface JournalEntry extends CreateJournalEntryInput {
  id: string;
  created_at: string;
  updated_at: string;
}

export const useJournal = () => {
  const createEntry = useCallback(
    async (entry: CreateJournalEntryInput): Promise<JournalEntry | null> => {
      try {
        const docRef = await addDoc(collection(db, "journalEntries"), {
          ...entry,
          strategy: entry.strategy || "",
          notes: entry.notes || "",
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        });

        const savedDoc = await getDoc(doc(db, "journalEntries", docRef.id));
        if (!savedDoc.exists()) return null;

        const data = savedDoc.data();

        return {
          id: savedDoc.id,
          ...data,
          created_at: data.created_at.toDate().toISOString(),
          updated_at: data.updated_at.toDate().toISOString(),
        } as JournalEntry;
      } catch (error) {
        console.error("Error creating journal entry:", error);
        return null;
      }
    },
    []
  );

  const getAllEntries = useCallback(
    async (userId: string): Promise<JournalEntry[]> => {
      try {
        const q = query(collection(db, "journalEntries"), where("userId", "==", userId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at.toDate().toISOString(),
            updated_at: data.updated_at.toDate().toISOString(),
          } as JournalEntry;
        });
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        return [];
      }
    },
    []
  );

  const editEntry = useCallback(
    async (id: string, updates: Partial<CreateJournalEntryInput>): Promise<boolean> => {
      try {
        await updateDoc(doc(db, "journalEntries", id), {
          ...updates,
          updated_at: Timestamp.now(),
        });
        return true;
      } catch (error) {
        console.error("Error updating journal entry:", error);
        return false;
      }
    },
    []
  );

  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, "journalEntries", id));
      return true;
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      return false;
    }
  }, []);

  return {
    createEntry,
    getAllEntries,
    editEntry,
    deleteEntry,
  };
};