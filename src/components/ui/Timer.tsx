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
  const isUrgent = timeLeft <= 5;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
      isCritical
        ? 'bg-red-500/20 border border-red-500/50'
        : isLow
        ? 'bg-amber-500/10 border border-amber-500/30'
        : 'bg-slate-800/50'
    }`}>
      {/* Warning Icon */}
      {isCritical && (
        <span className={`text-xl ${isUrgent ? 'animate-bounce' : 'animate-pulse'}`}>
          ⚠️
        </span>
      )}

      {/* Progress Bar */}
      <div className="relative w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-blue-500'
          } ${isUrgent ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Time Display */}
      <span
        className={`font-mono text-xl font-bold min-w-[4rem] text-right ${
          isCritical
            ? `text-red-400 ${isUrgent ? 'animate-pulse scale-110' : ''}`
            : isLow
            ? 'text-amber-400'
            : 'text-white'
        }`}
      >
        {formatTime(timeLeft)}
      </span>

      {/* Urgent Label */}
      {isUrgent && (
        <span className="text-red-400 text-xs font-bold uppercase animate-pulse">
          Hurry!
        </span>
      )}
    </div>
  );
}
