import { useEffect, useState } from 'react';

interface RaceTrackProps {
  team1Name: string;
  team2Name: string;
  team1Position: number;
  team2Position: number;
  totalRounds: number;
  showFinishAnimation?: boolean;
}

export function RaceTrack({
  team1Name,
  team2Name,
  team1Position,
  team2Position,
  totalRounds,
  showFinishAnimation = false,
}: RaceTrackProps) {
  const [animatedTeam1, setAnimatedTeam1] = useState(0);
  const [animatedTeam2, setAnimatedTeam2] = useState(0);

  // Max possible score is 100 per round
  const maxScore = totalRounds * 100;

  // Calculate percentage positions
  const team1Percent = Math.min((team1Position / maxScore) * 100, 100);
  const team2Percent = Math.min((team2Position / maxScore) * 100, 100);

  useEffect(() => {
    // Animate to new positions
    const timer = setTimeout(() => {
      setAnimatedTeam1(team1Percent);
      setAnimatedTeam2(team2Percent);
    }, 100);

    return () => clearTimeout(timer);
  }, [team1Percent, team2Percent]);

  const winner =
    showFinishAnimation && team1Position !== team2Position
      ? team1Position > team2Position
        ? 1
        : 2
      : null;

  return (
    <div className="w-full py-6">
      {/* Track Container */}
      <div className="relative">
        {/* Track Background */}
        <div className="relative h-32 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          {/* Lane Divider */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-600 border-dashed" />

          {/* Distance Markers */}
          {[25, 50, 75].map((marker) => (
            <div
              key={marker}
              className="absolute top-0 bottom-0 w-px bg-slate-700"
              style={{ left: `${marker}%` }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                {marker}%
              </span>
            </div>
          ))}

          {/* Finish Line */}
          <div className="absolute top-0 bottom-0 right-4 w-1 bg-gradient-to-b from-white via-slate-400 to-white" />
          <div className="absolute top-0 bottom-0 right-2 flex flex-col justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17.2l.9-5.5-4-3.9 5.5-.8L10 2z" />
            </svg>
          </div>

          {/* Team 1 Lane (Top) */}
          <div className="absolute top-2 left-4 right-12 h-12">
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{ left: `${animatedTeam1}%` }}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  winner === 1
                    ? 'bg-yellow-500 text-yellow-900 animate-pulse'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <span className="font-medium text-sm whitespace-nowrap">{team1Name}</span>
              </div>
            </div>
          </div>

          {/* Team 2 Lane (Bottom) */}
          <div className="absolute bottom-2 left-4 right-12 h-12">
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{ left: `${animatedTeam2}%` }}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  winner === 2
                    ? 'bg-yellow-500 text-yellow-900 animate-pulse'
                    : 'bg-purple-600 text-white'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="font-medium text-sm whitespace-nowrap">{team2Name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex justify-between mt-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-600" />
            <span className="text-slate-300">{team1Name}</span>
            <span className="font-bold text-white">{team1Position} pts</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-purple-600" />
            <span className="text-slate-300">{team2Name}</span>
            <span className="font-bold text-white">{team2Position} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
