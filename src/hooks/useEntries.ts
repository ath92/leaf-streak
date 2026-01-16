import { useState, useEffect, useCallback } from "preact/hooks";
import type { Entry, EntriesResponse } from "../types";
import { fetchEntries, createEntry, getToday } from "../api";

interface UseEntriesResult {
  entries: Entry[];
  total: number;
  streak: number;
  todayEntry: Entry | null;
  loading: boolean;
  error: string | null;
  submitEntry: (points: number, date?: string) => Promise<void>;
}

function calculateStreak(entries: Entry[]): number {
  let streak = 0;
  for (const entry of entries) {
    if (entry.points === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function fillMissingDates(entries: Entry[]): Entry[] {
  if (entries.length === 0) return [];

  const today = getToday();
  const newestDateStr = entries[0].date > today ? entries[0].date : today;
  const oldestDateStr = entries[entries.length - 1].date;

  const filledEntries: Entry[] = [];
  const currentDate = new Date(newestDateStr);
  const endDate = new Date(oldestDateStr);
  
  // Set times to midnight to avoid issues
  currentDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  let entryIndex = 0;

  while (currentDate >= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    
    if (entryIndex < entries.length && entries[entryIndex].date === dateStr) {
      filledEntries.push(entries[entryIndex]);
      entryIndex++;
    } else {
      filledEntries.push({
        id: -1, // Placeholder ID
        date: dateStr,
        points: 0,
        created_at: new Date().toISOString(),
      });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  }

  return filledEntries;
}

export function useEntries(streakId: string = "default"): UseEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: EntriesResponse = await fetchEntries(streakId);
      const filled = fillMissingDates(data.entries);
      setEntries(filled);
      setTotal(data.total);
      setStreak(calculateStreak(filled));
      setTodayEntry(data.todayEntry);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, [streakId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const submitEntry = useCallback(async (points: number, date?: string) => {
    try {
      setError(null);
      const entry = await createEntry(points, date, streakId);
      if (!date) {
        setTodayEntry(entry);
      }
      await loadEntries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit entry");
      throw e;
    }
  }, [loadEntries, streakId]);

  return {
    entries,
    total,
    streak,
    todayEntry,
    loading,
    error,
    submitEntry,
  };
}
