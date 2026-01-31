import { useState, useMemo } from "preact/hooks";
import type { Entry } from "../types";

interface CalendarViewProps {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function CalendarView({ entries, onEditEntry }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const entriesByDate = useMemo(() => {
    const map = new Map<string, Entry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // Sunday is 0, Monday is 1, etc.
    // We want Monday to be 0, so (day + 6) % 7
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7;
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    const today = new Date();
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    if (nextMonth <= today) {
       setViewDate(nextMonth);
    }
  };

  const canGoNext = () => {
      const today = new Date();
      return new Date(currentYear, currentMonth + 1, 1) <= today;
  }

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} class="calendar-day empty"></div>);
    }

    const today = new Date();
    // Reset time to confirm future check relies on date only, or keeps time?
    // Actually simpler: check if dateStr > todayStr or similar?
    // But "future" implies "after today". 
    // Let's stick to comparing timestamps for "isFuture" but ensure consistency.
    // If today is 25th. Cell 25th (00:00). 25th 00:00 <= 25th 12:00. Not future.
    // Cell 26th (00:00). 26th 00:00 > 25th 12:00. Future.
    // So `date > today` works fine.

    const todayStr = getLocalDateString(today);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dateStr = getLocalDateString(date);
      const entry = entriesByDate.get(dateStr);
      const isToday = dateStr === todayStr;
      
      let className = "calendar-day";
      if (isToday) className += " today";
      
      let pointClass = "";
      if (entry) {
          if (entry.points >= 1) pointClass = "point-full";
          else if (entry.points >= 0.5) pointClass = "point-half";
          else if (entry.points > 0) pointClass = "point-quarter";
      }

      // Check if date is in the future
      // We use midnight of the cell date vs current time.
      const isFuture = date > today;
      if (isFuture) className += " future";

      days.push(
        <button
          key={d}
          class={`${className} ${pointClass}`}
          onClick={() => {
            if (isFuture) return;
            onEditEntry(entry ?? {
              id: -1,
              date: dateStr,
              points: 0,
              created_at: new Date().toISOString()
            });
          }}
          disabled={isFuture}
        >
          <span class="day-number">{d}</span>
          {entry && entry.points > 0 && (
             <span class="day-points-indicator"></span>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div class="calendar-view">
      <div class="calendar-header">
        <button onClick={handlePrevMonth} class="nav-button">&lt;</button>
        <h3>
          {viewDate.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button 
            onClick={handleNextMonth} 
            class="nav-button" 
            disabled={!canGoNext()}
            style={{ visibility: canGoNext() ? 'visible' : 'hidden' }}
        >
            &gt;
        </button>
      </div>
      <div class="calendar-grid-header">
        {DAYS.map((day) => (
          <div key={day} class="day-label">
            {day}
          </div>
        ))}
      </div>
      <div class="calendar-grid">{renderDays()}</div>
    </div>
  );
}
