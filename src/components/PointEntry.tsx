import { useState } from "preact/hooks";

interface PointEntryProps {
  onSubmit: (points: number) => Promise<void>;
  onCancel?: () => void;
}

export function PointEntry({ onSubmit, onCancel }: PointEntryProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async (points: number) => {
    setSubmitting(true);
    try {
      await onSubmit(points);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="point-entry">
      <h2>{onCancel ? "Change Today's Points" : "Log Today's Points"}</h2>
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
