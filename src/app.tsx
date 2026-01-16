import "./app.css";
import { useState } from "preact/hooks";
import { useEntries } from "./hooks/useEntries";
import { PointEntry } from "./components/PointEntry";
import { Overview } from "./components/Overview";
import type { Entry } from "./types";

export function App() {
  const { entries, total, todayEntry, loading, error, submitEntry } = useEntries();
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const handleSubmit = async (points: number) => {
    await submitEntry(points, editingDate ?? undefined);
    setEditingDate(null);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingDate(entry.date);
  };

  if (loading) {
    return (
      <div class="container">
        <h1>Leaf Streak</h1>
        <p class="loading">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div class="container">
        <h1>Leaf Streak</h1>
        <p class="error">{error}</p>
      </div>
    );
  }

  const showPointEntry = !todayEntry || editingDate !== null;

  return (
    <div class="container">
      <h1>Leaf Streak</h1>
      {showPointEntry ? (
        <PointEntry
          onSubmit={handleSubmit}
          onCancel={todayEntry ? () => setEditingDate(null) : undefined}
          editingDate={editingDate ?? undefined}
        />
      ) : (
        <Overview
          todayEntry={todayEntry}
          total={total}
          entries={entries}
          onEdit={() => setEditingDate(todayEntry.date)}
          onEditEntry={handleEditEntry}
        />
      )}
    </div>
  );
}
