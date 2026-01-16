import type { EntriesResponse, Entry } from "./types";

export function getToday(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export async function fetchEntries(): Promise<EntriesResponse> {
  const today = getToday();
  const response = await fetch(`/api/entries?today=${today}`);
  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }
  return response.json();
}

export async function createEntry(points: number): Promise<Entry> {
  const date = getToday();
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, points }),
  });
  if (!response.ok) {
    throw new Error("Failed to create entry");
  }
  const data = await response.json();
  return data.entry;
}
