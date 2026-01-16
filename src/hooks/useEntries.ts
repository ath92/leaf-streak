import { useState, useEffect, useCallback } from "preact/hooks";
import type { Entry, EntriesResponse } from "../types";
import { fetchEntries, createEntry } from "../api";

interface UseEntriesResult {
  entries: Entry[];
  total: number;
  todayEntry: Entry | null;
  loading: boolean;
  error: string | null;
  submitEntry: (points: number, date?: string) => Promise<void>;
}

export function useEntries(): UseEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: EntriesResponse = await fetchEntries();
      setEntries(data.entries);
      setTotal(data.total);
      setTodayEntry(data.todayEntry);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const submitEntry = useCallback(async (points: number, date?: string) => {
    try {
      setError(null);
      const entry = await createEntry(points, date);
      if (!date) {
        setTodayEntry(entry);
      }
      await loadEntries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit entry");
      throw e;
    }
  }, [loadEntries]);

  return {
    entries,
    total,
    todayEntry,
    loading,
    error,
    submitEntry,
  };
}
