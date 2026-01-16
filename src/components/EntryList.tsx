import type { Entry } from "../types";

interface EntryListProps {
  entries: Entry[];
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

export function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) {
    return <p class="no-entries">No entries yet</p>;
  }

  return (
    <div class="entry-list">
      <h3>History</h3>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} class="entry-item">
            <span class="entry-date">{formatDate(entry.date)}</span>
            <span class="entry-points">{formatPoints(entry.points)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
