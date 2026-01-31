import { useState, useMemo } from "preact/hooks";
import type { Entry } from "../types";

interface CalendarViewProps {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

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
    return new Date(year, month, 1).getDay();
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

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} class="calendar-day empty"></div>);
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dateStr = date.toISOString().split('T')[0];
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
      const isFuture = date > today;
      if (isFuture) className += " future";

      days.push(
        <button
          key={d}
          class={`${className} ${pointClass}`}
          onClick={() => entry && !isFuture ? onEditEntry(entry) : null}
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
