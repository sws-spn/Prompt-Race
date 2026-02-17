import { useEffect, useState } from 'react';

interface RaceTrackProps {
  team1Name: string;
  team2Name: string;
  team1Position: number;
  team2Position: number;
  totalRounds: number;
  showFinishAnimation?: boolean;
}

// Vehicle SVG components
function Bicycle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-9-3h4l-1.5-3H12l2 3h-4zm-2.5 5L5 14l2-4 2.5 2L12 9l-1 5H7.5zm7-2l2.5-2 2 4-2.5.5L14 12z"/>
    </svg>
  );
}

function DirtBike({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM5 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm10-8l2 4h2l-3-6h-3l-2 2-3-2H6l1 4 3-1 2 3h3zm-4 4l-1 4h2l1-3 2 1 1-2h-5z"/>
    </svg>
  );
}

function Car({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 17a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm14 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm1-6h-1l-2-4H7L5 11H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1.05a2.5 2.5 0 0 1 4.9 0h6.1a2.5 2.5 0 0 1 4.9 0H21a1 1 0 0 0 1-1v-2a2 2 0 0 0-2-2zm-12-2h8l1 2H7l1-2z"/>
    </svg>
  );
}

function IndyCar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 13v2h-2v-2h-1l-1-3h-2V8h-4v2H8l-1 3H4v2H2v-2a2 2 0 0 1 2-2h2l1-3h2V6h8v2h2l1 3h2a2 2 0 0 1 2 2zM6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>
  );
}

function getVehicle(percent: number, className: string) {
  if (percent >= 75) return <IndyCar className={className} />;
  if (percent >= 50) return <Car className={className} />;
  if (percent >= 25) return <DirtBike className={className} />;
  return <Bicycle className={className} />;
}

function getVehicleName(percent: number) {
  if (percent >= 75) return 'Indy Car';
  if (percent >= 50) return 'Car';
  if (percent >= 25) return 'Dirt Bike';
  return 'Bicycle';
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

  // Calculate percentages
  let team1Percent: number;
  let team2Percent: number;

  if (showFinishAnimation) {
    // On final results: winner crosses finish line (100%), loser scaled proportionally
    const maxPosition = Math.max(team1Position, team2Position);
    if (maxPosition > 0) {
      // Winner gets 100%, other team scaled relative to winner
      team1Percent = (team1Position / maxPosition) * 100;
      team2Percent = (team2Position / maxPosition) * 100;
    } else {
      team1Percent = 0;
      team2Percent = 0;
    }
  } else {
    // During game: use theoretical max score for progress
    const maxScore = totalRounds * 100;
    team1Percent = Math.min((team1Position / maxScore) * 100, 100);
    team2Percent = Math.min((team2Position / maxScore) * 100, 100);
  }

  useEffect(() => {
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
        {/* Track Background - Asphalt style */}
        <div className="relative h-40 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-700 rounded-xl border-4 border-slate-600 overflow-hidden shadow-inner">

          {/* Track texture lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-slate-500"
                style={{ left: `${i * 5}%` }}
              />
            ))}
          </div>

          {/* Lane Divider - Dashed white line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-px h-0.5 flex">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="flex-1 mx-1 bg-yellow-400/60 rounded" />
            ))}
          </div>

          {/* Start Line */}
          <div className="absolute top-0 bottom-0 left-6 w-2 flex flex-col">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-900'}`} />
            ))}
          </div>

          {/* Distance Markers */}
          {[25, 50, 75].map((marker) => (
            <div
              key={marker}
              className="absolute top-0 bottom-0 w-0.5 bg-white/20"
              style={{ left: `${marker}%` }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-mono">
                {marker}%
              </span>
            </div>
          ))}

          {/* Finish Line - Checkered pattern */}
          <div className="absolute top-0 bottom-0 right-6 w-4 grid grid-cols-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className={`${(Math.floor(i / 2) + i) % 2 === 0 ? 'bg-white' : 'bg-slate-900'}`} />
            ))}
          </div>

          {/* Trophy at finish */}
          <div className="absolute top-1/2 -translate-y-1/2 right-1">
            <span className="text-2xl">🏁</span>
          </div>

          {/* Team 1 Lane (Top) */}
          <div className="absolute top-3 left-10 right-14 h-14">
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out flex items-center"
              style={{ left: `calc(${animatedTeam1}% - 20px)` }}
            >
              <div
                className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg shadow-lg ${
                  winner === 1
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 animate-pulse'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                }`}
              >
                {getVehicle(team1Percent, 'w-8 h-8')}
                <span className="font-bold text-sm whitespace-nowrap">{team1Name}</span>
              </div>
            </div>
          </div>

          {/* Team 2 Lane (Bottom) */}
          <div className="absolute bottom-3 left-10 right-14 h-14">
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out flex items-center"
              style={{ left: `calc(${animatedTeam2}% - 20px)` }}
            >
              <div
                className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg shadow-lg ${
                  winner === 2
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                }`}
              >
                {getVehicle(team2Percent, 'w-8 h-8')}
                <span className="font-bold text-sm whitespace-nowrap">{team2Name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Display with Vehicle Status */}
        <div className="flex justify-between mt-4 px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
              {getVehicle(team1Percent, 'w-5 h-5 text-blue-400')}
              <span className="text-blue-400 text-sm font-medium">{getVehicleName(team1Percent)}</span>
            </div>
            <span className="text-slate-300">{team1Name}</span>
            <span className="font-bold text-white">{team1Position} pts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-300">{team2Name}</span>
            <span className="font-bold text-white">{team2Position} pts</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 rounded-lg border border-purple-500/30">
              {getVehicle(team2Percent, 'w-5 h-5 text-purple-400')}
              <span className="text-purple-400 text-sm font-medium">{getVehicleName(team2Percent)}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Upgrade Legend */}
        <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Bicycle className="w-4 h-4" />
            <span>0-24%</span>
          </div>
          <div className="flex items-center gap-1">
            <DirtBike className="w-4 h-4" />
            <span>25-49%</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>50-74%</span>
          </div>
          <div className="flex items-center gap-1">
            <IndyCar className="w-4 h-4" />
            <span>75%+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
