import "./app.css";
import { useState } from "preact/hooks";
import { useEntries } from "./hooks/useEntries";
import { PointEntry } from "./components/PointEntry";
import { Overview } from "./components/Overview";
import type { Entry } from "./types";
import { getToday } from "./api";

interface AppProps {
  streakId?: string;
}

export function App({ streakId = "default" }: AppProps) {
  const { entries, total, streak, todayEntry, loading, error, submitEntry } =
    useEntries(streakId);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const handleSubmit = async (points: number) => {
    await submitEntry(points, editingDate ?? undefined);
    setEditingDate(null);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingDate(entry.date);
  };

  const handleAddEntry = () => {
    setEditingDate(getToday());
  };

  const displayName = streakId === "default" ? "Leaf Streak" : `${streakId.charAt(0).toUpperCase() + streakId.slice(1)} Streak`;

  if (loading) {
    return (
      <div class="container">
        <h1>{displayName}</h1>
        <p class="loading">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div class="container">
        <h1>{displayName}</h1>
        <p class="error">{error}</p>
      </div>
    );
  }

  const showPointEntry = !todayEntry || editingDate !== null;

  return (
    <div class="container">
      <h1>{displayName}</h1>
      {showPointEntry ? (
        <PointEntry
          onSubmit={handleSubmit}
          onCancel={todayEntry ? () => setEditingDate(null) : undefined}
          editingDate={editingDate ?? undefined}
          setEditingDate={setEditingDate}
        />
      ) : (
        <Overview
          todayEntry={todayEntry}
          total={total}
          streak={streak}
          entries={entries}
          onEdit={() => setEditingDate(todayEntry.date)}
          onEditEntry={handleEditEntry}
          onAddEntry={handleAddEntry}
        />
      )}
    </div>
  );
}
