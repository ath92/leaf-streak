import "./app.css";
import { useEntries } from "./hooks/useEntries";
import { PointEntry } from "./components/PointEntry";
import { Overview } from "./components/Overview";

export function App() {
  const { entries, total, todayEntry, loading, error, submitEntry } = useEntries();

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

  return (
    <div class="container">
      <h1>Leaf Streak</h1>
      {todayEntry ? (
        <Overview todayEntry={todayEntry} total={total} entries={entries} />
      ) : (
        <PointEntry onSubmit={submitEntry} />
      )}
    </div>
  );
}
