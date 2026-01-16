import "./app.css";
import { useState } from "preact/hooks";
import { useEntries } from "./hooks/useEntries";
import { PointEntry } from "./components/PointEntry";
import { Overview } from "./components/Overview";

export function App() {
  const { entries, total, todayEntry, loading, error, submitEntry } = useEntries();
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (points: number) => {
    await submitEntry(points);
    setEditing(false);
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

  const showPointEntry = !todayEntry || editing;

  return (
    <div class="container">
      <h1>Leaf Streak</h1>
      {showPointEntry ? (
        <PointEntry
          onSubmit={handleSubmit}
          onCancel={todayEntry ? () => setEditing(false) : undefined}
        />
      ) : (
        <Overview
          todayEntry={todayEntry}
          total={total}
          entries={entries}
          onEdit={() => setEditing(true)}
        />
      )}
    </div>
  );
}
