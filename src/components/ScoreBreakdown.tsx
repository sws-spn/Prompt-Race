import type { TeamScore } from '../types';

interface ScoreBreakdownProps {
  score: TeamScore;
  teamName: string;
  teamColor: 'blue' | 'purple';
}

const CRITERIA = [
  { key: 'context', label: 'Context' },
  { key: 'taskClarity', label: 'Task Clarity' },
  { key: 'constraintsFormat', label: 'Constraints' },
  { key: 'aupAwareness', label: 'AUP Awareness' },
  { key: 'practicalValue', label: 'Practical Value' },
] as const;

export function ScoreBreakdown({ score, teamName, teamColor }: ScoreBreakdownProps) {
  const colors = {
    blue: {
      bar: 'bg-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    purple: {
      bar: 'bg-purple-500',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
  };

  const c = colors[teamColor];

  return (
    <div className={`p-6 rounded-xl ${c.bg} border ${c.border}`}>
      {/* Team Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${c.text}`}>{teamName}</h3>
        <div className="text-3xl font-bold text-white">{score.total}</div>
      </div>

      {/* Score Bars */}
      <div className="space-y-3 mb-4">
        {CRITERIA.map(({ key, label }) => {
          const value = score[key];
          const percentage = (value / 20) * 100;

          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-medium">{value}/20</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <div className="pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-300 italic">"{score.feedback}"</p>
      </div>
    </div>
  );
}
