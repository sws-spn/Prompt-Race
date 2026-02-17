import { useEffect, useState, useCallback } from 'react';

interface TimerProps {
  seconds: number;
  onComplete: () => void;
  isRunning: boolean;
}

export function Timer({ seconds, onComplete, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, timeLeft]);

  const formatTime = useCallback((secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  }, []);

  const percentage = (timeLeft / seconds) * 100;
  const isLow = timeLeft <= 30;
  const isCritical = timeLeft <= 10;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-48 h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`font-mono text-xl font-bold ${
          isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white'
        }`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
