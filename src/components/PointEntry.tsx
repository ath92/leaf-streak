import { useState } from "preact/hooks";

interface PointEntryProps {
  onSubmit: (points: number) => Promise<void>;
  onCancel?: () => void;
  editingDate?: string;
  setEditingDate?: (date: string) => void;
}

function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function PointEntry({
  onSubmit,
  onCancel,
  editingDate,
  setEditingDate,
}: PointEntryProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async (points: number) => {
    setSubmitting(true);
    try {
      await onSubmit(points);
    } finally {
      setSubmitting(false);
    }
  };

  const getHeading = () => {
    if (!onCancel) return "Log Today's Points";
    if (editingDate) {
      if (setEditingDate) {
        return (
          <>
            Edit{" "}
            <input
              type="date"
              class="date-input"
              value={editingDate}
              onChange={(e) => setEditingDate(e.currentTarget.value)}
            />
          </>
        );
      }
      return `Edit ${formatDateForDisplay(editingDate)}`;
    }
    return "Change Today's Points";
  };

  return (
    <div class="point-entry">
      <h2>{getHeading()}</h2>
      <div class="point-buttons">
        <button
          class="point-button point-1"
          onClick={() => handleClick(1)}
          disabled={submitting}
        >
          1 pt
        </button>
        <button
          class="point-button point-half"
          onClick={() => handleClick(0.5)}
          disabled={submitting}
        >
          1/2 pt
        </button>
        <button
          class="point-button point-quarter"
          onClick={() => handleClick(0.25)}
          disabled={submitting}
        >
          1/4 pt
        </button>
      </div>
      {onCancel && (
        <button class="cancel-button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      )}
    </div>
  );
}
