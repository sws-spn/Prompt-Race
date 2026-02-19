import { useState } from 'react';
import { Button, Card } from '../components/ui';
import { useGame } from '../context/GameContext';

export function PracticeResultsScreen() {
  const { state, dispatch } = useGame();
  const [showBreakdown, setShowBreakdown] = useState(true);

  const latestResult = state.practiceResults[state.practiceResults.length - 1];
  const isLastRound = state.currentRound >= state.settings.totalRounds;
  const scenario = latestResult.scenario;

  const handleNextRound = () => {
    dispatch({ type: 'NEXT_PRACTICE_ROUND' });
  };

  const handleViewFinal = () => {
    dispatch({ type: 'END_GAME' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 75) return 'Great job!';
    if (score >= 60) return 'Good effort';
    if (score >= 40) return 'Keep practicing';
    return 'Needs improvement';
  };

  // Calculate running totals
  const totalScore = state.practiceResults.reduce((sum, r) => sum + r.score.total, 0);
  const averageScore = Math.round(totalScore / state.practiceResults.length);

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-2">
          <span className="text-emerald-400 font-semibold">Practice Mode</span>
        </div>
        <h1 className="text-3xl font-bold text-white mt-2">{getScoreLabel(latestResult.score.total)}</h1>
        <p className="text-slate-400 mt-1">
          Scenario {state.currentRound} of {state.settings.totalRounds}
        </p>
      </div>

      {/* Score Display */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">This Round</h3>
          <div className={`text-5xl font-bold ${getScoreColor(latestResult.score.total)}`}>
            {latestResult.score.total}
            <span className="text-2xl text-slate-500">/100</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Completed in {latestResult.timeSpent} seconds
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Running Average</h3>
          <div className={`text-5xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}
            <span className="text-2xl text-slate-500">/100</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Total: {totalScore} pts across {state.practiceResults.length} scenario{state.practiceResults.length > 1 ? 's' : ''}
          </p>
        </Card>
      </div>

      {/* Score Breakdown */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Score Breakdown</h3>
        <div className="grid grid-cols-5 gap-4 text-center">
          {[
            { label: 'Context', score: latestResult.score.context, icon: '📋' },
            { label: 'Clarity', score: latestResult.score.taskClarity, icon: '🎯' },
            { label: 'Format', score: latestResult.score.constraintsFormat, icon: '📐' },
            { label: 'AUP', score: latestResult.score.aupAwareness, icon: '🛡️' },
            { label: 'Practical', score: latestResult.score.practicalValue, icon: '⚡' },
          ].map(({ label, score, icon }) => (
            <div key={label} className="p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl mb-1">{icon}</div>
              <div className={`text-xl font-bold ${score >= 15 ? 'text-green-400' : score >= 10 ? 'text-blue-400' : 'text-amber-400'}`}>
                {score}
              </div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Side-by-Side Comparison */}
      <Card className="mb-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-lg font-bold text-amber-400">Compare to Gold Standard</h3>
              <p className="text-sm text-slate-400">See how your prompt stacks up</p>
            </div>
          </div>
          <span className={`text-slate-400 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showBreakdown && (
          <div className="mt-4 pt-4 border-t border-amber-500/20">
            {/* Scenario Context */}
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-400 mb-1">Scenario</h4>
              <p className="text-white font-medium">{scenario.title}</p>
              <p className="text-slate-300 text-sm mt-1">{scenario.situation}</p>
            </div>

            {/* Side-by-Side */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Your Prompt */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 text-sm font-medium">Your Prompt</span>
                  <span className="text-slate-500 text-xs">{latestResult.score.total} pts</span>
                </div>
                <p className="text-slate-300 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {latestResult.prompt}
                </p>
              </div>

              {/* Gold Standard */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-400 text-sm font-medium">Gold Standard</span>
                  <span className="text-amber-500 text-xs">100 pts</span>
                </div>
                <p className="text-slate-300 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                  {scenario.examplePrompt.prompt}
                </p>
              </div>
            </div>

            {/* Breakdown by Criteria */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-amber-300">Why the Gold Standard Excels</h4>

              {[
                { key: 'context', label: 'Context', borderClass: 'border-blue-500', textClass: 'text-blue-400' },
                { key: 'taskClarity', label: 'Task Clarity', borderClass: 'border-green-500', textClass: 'text-green-400' },
                { key: 'constraintsFormat', label: 'Constraints & Format', borderClass: 'border-purple-500', textClass: 'text-purple-400' },
                { key: 'aupAwareness', label: 'AUP Awareness', borderClass: 'border-amber-500', textClass: 'text-amber-400' },
                { key: 'practicalValue', label: 'Practical Value', borderClass: 'border-rose-500', textClass: 'text-rose-400' },
              ].map(({ key, label, borderClass, textClass }) => (
                <div key={key} className={`p-2 bg-slate-900/50 rounded border-l-4 ${borderClass}`}>
                  <span className={`${textClass} font-medium text-sm`}>{label}</span>
                  <p className="text-slate-300 text-xs mt-1">
                    {scenario.examplePrompt.breakdown[key as keyof typeof scenario.examplePrompt.breakdown]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="mt-4 flex justify-center gap-4">
        {isLastRound ? (
          <Button size="lg" onClick={handleViewFinal}>
            View Final Results
          </Button>
        ) : (
          <Button size="lg" onClick={handleNextRound}>
            Next Scenario ({state.currentRound + 1}/{state.settings.totalRounds})
          </Button>
        )}
      </div>
    </div>
  );
}
