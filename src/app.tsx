import "./app.css";
import { useState } from "preact/hooks";
import { useEntries } from "./hooks/useEntries";
import { PointEntry } from "./components/PointEntry";
import { Overview } from "./components/Overview";
import type { Entry } from "./types";
import { getToday } from "./api";

export function App() {
  const { entries, total, streak, todayEntry, loading, error, submitEntry } =
    useEntries();
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

  const showPointEntry = editingDate !== null;

  return (
    <div class="container">
      <h1>Leaf Streak</h1>
      {showPointEntry ? (
        <PointEntry
          onSubmit={handleSubmit}
          onCancel={() => setEditingDate(null)}
          editingDate={editingDate ?? undefined}
          setEditingDate={setEditingDate}
        />
      ) : (
        <Overview
          todayEntry={todayEntry}
          total={total}
          streak={streak}
          entries={entries}
          onEdit={() =>
            setEditingDate(todayEntry ? todayEntry.date : getToday())
          }
          onEditEntry={handleEditEntry}
          onAddEntry={handleAddEntry}
        />
      )}
    </div>
  );
}
