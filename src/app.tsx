import "./app.css";
import { useState } from "preact/hooks";
import { useEntries } from "./hooks/useEntries";
import { PointEntry } from "./components/PointEntry";
import { Overview } from "./components/Overview";
import type { Entry } from "./types";
import { getToday } from "./api";
import { Link } from "wouter";

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

  const getDisplayName = (id: string) => {
    if (id === "default") return "Leaf Streak";
    
    // Check if the ID ends with the delimiter and 6 alphanumeric characters
    // and strip it for display if it does
    const cleanId = id.replace(/_~_[a-z0-9]{6}$/, "");
    
    return `${cleanId.charAt(0).toUpperCase() + cleanId.slice(1)} Streak`;
  };

  const displayName = getDisplayName(streakId);

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
      <header class="app-header">
        <h1>{displayName}</h1>
        <Link href="/" class="switch-link">
          Switch
        </Link>
      </header>
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
