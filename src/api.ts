import type { EntriesResponse, Entry } from "./types";

export function getToday(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export async function fetchEntries(streakId: string = "default"): Promise<EntriesResponse> {
  const today = getToday();
  const response = await fetch(`/api/entries?today=${today}&streakId=${streakId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }
  return response.json();
}

export async function createEntry(points: number, date?: string, streakId: string = "default"): Promise<Entry> {
  const entryDate = date ?? getToday();
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: entryDate, points, streakId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create entry");
  }
  const data = await response.json();
  return data.entry;
}
