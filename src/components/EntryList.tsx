import type { Entry } from "../types";

interface EntryListProps {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

function formatPoints(points: number): string {
  if (points === 1) return "1 pt";
  if (points === 0.5) return "1/2 pt";
  if (points === 0.25) return "1/4 pt";
  return `${points} pt`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function EntryList({ entries, onEditEntry }: EntryListProps) {
  if (entries.length === 0) {
    return <p class="no-entries">No entries yet</p>;
  }

  return (
    <div class="entry-list">
      <h3>History</h3>
      <ul>
        {entries.map((entry) => (
          <li key={entry.date} class="entry-item">
            <span class="entry-date">{formatDate(entry.date)}</span>
            <div class="entry-actions">
              <span class="entry-points">{formatPoints(entry.points)}</span>
              <button
                class="entry-edit-button"
                onClick={() => onEditEntry(entry)}
                aria-label={`Edit ${formatDate(entry.date)}`}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
