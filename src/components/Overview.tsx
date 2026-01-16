import type { Entry } from "../types";
import { EntryList } from "./EntryList";

interface OverviewProps {
  todayEntry: Entry;
  total: number;
  entries: Entry[];
  onEdit: () => void;
  onEditEntry: (entry: Entry) => void;
}

function formatPoints(points: number): string {
  if (points === 1) return "1 pt";
  if (points === 0.5) return "1/2 pt";
  if (points === 0.25) return "1/4 pt";
  return `${points} pt`;
}

export function Overview({ todayEntry, total, entries, onEdit, onEditEntry }: OverviewProps) {
  return (
    <div class="overview">
      <div class="today-status">
        <h2>Today</h2>
        <p class="today-points">{formatPoints(todayEntry.points)}</p>
        <button class="edit-button" onClick={onEdit}>
          Change
        </button>
      </div>

      <div class="total-section">
        <h3>Total Points</h3>
        <p class="total-points">{total}</p>
      </div>

      <EntryList entries={entries} onEditEntry={onEditEntry} />
    </div>
  );
}
