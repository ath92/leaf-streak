export interface Entry {
  id: number;
  date: string;
  points: number;
  created_at: string;
}

export interface EntriesResponse {
  entries: Entry[];
  total: number;
  todayEntry: Entry | null;
}
