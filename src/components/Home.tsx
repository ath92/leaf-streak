import { useState } from "preact/hooks";
import { useLocation } from "wouter";

export function Home() {
  const [streakName, setStreakName] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (streakName.trim()) {
      // Generate a random 6-character string to prevent collisions
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const fullStreakId = `${streakName.trim()}_~_${randomSuffix}`;
      
      // URL encode the streak name to be safe
      const encodedName = encodeURIComponent(fullStreakId);
      setLocation(`/${encodedName}`);
    }
  };

  return (
    <div class="container home-container">
      <h1>Leaf Streak</h1>
      <p class="intro-text">
        Track your daily habits and keep your streaks alive.
      </p>
      
      <form onSubmit={handleSubmit} class="streak-form">
        <label htmlFor="streak-name-input">Enter a streak name to get started:</label>
        <div class="input-group">
          <input
            id="streak-name-input"
            type="text"
            class="streak-name-input"
            value={streakName}
            onInput={(e) => setStreakName(e.currentTarget.value)}
            placeholder="e.g., Reading, Exercise"
            required
          />
          <button type="submit" class="start-button">
            Go
          </button>
        </div>
      </form>
    </div>
  );
}
