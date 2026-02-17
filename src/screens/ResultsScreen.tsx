import { useState, useEffect } from 'react';
import { Button, Card } from '../components/ui';
import { RaceTrack } from '../components/RaceTrack';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { Confetti } from '../components/Confetti';
import { useGame } from '../context/GameContext';

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const [showGoldStandard, setShowGoldStandard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const latestResult = state.roundResults[state.roundResults.length - 1];
  const isLastRound = state.currentRound >= state.settings.totalRounds;

  // Trigger confetti when there's a clear winner
  useEffect(() => {
    if (latestResult && latestResult.team1Score.total !== latestResult.team2Score.total) {
      setShowConfetti(true);
    }
  }, [latestResult]);

  const handleNextRound = () => {
    dispatch({ type: 'NEXT_ROUND' });
  };

  const handleViewFinal = () => {
    dispatch({ type: 'END_GAME' });
  };

  if (!latestResult) return null;

  const team1Won = latestResult.team1Score.total > latestResult.team2Score.total;
  const isTie = latestResult.team1Score.total === latestResult.team2Score.total;

  return (
    <div className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full overflow-auto">
      {/* Confetti Celebration */}
      <Confetti isActive={showConfetti} duration={3000} />

      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-slate-400">
          Round {state.currentRound} of {state.settings.totalRounds}
        </span>
        <h1 className="text-3xl font-bold text-white mt-2">
          {isTie ? "It's a Tie!" : team1Won ? `${state.settings.team1Name} Takes the Lead!` : `${state.settings.team2Name} Takes the Lead!`}
        </h1>

        {/* Streak Display */}
        {(state.team1Streak >= 2 || state.team2Streak >= 2) && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full">
            <span className="text-2xl">{state.team1Streak >= 2 || state.team2Streak >= 2 ? '🔥' : ''}</span>
            <span className="text-amber-400 font-bold">
              {state.team1Streak >= 2
                ? `${state.settings.team1Name} is on a ${state.team1Streak}-win streak!`
                : `${state.settings.team2Name} is on a ${state.team2Streak}-win streak!`}
            </span>
            {(state.team1Streak >= 3 || state.team2Streak >= 3) && <span className="text-lg">⭐</span>}
            {(state.team1Streak >= 5 || state.team2Streak >= 5) && <span className="text-lg">🌟</span>}
          </div>
        )}
      </div>

      {/* Race Track */}
      <RaceTrack
        team1Name={state.settings.team1Name}
        team2Name={state.settings.team2Name}
        team1Position={state.team1Position}
        team2Position={state.team2Position}
        totalRounds={state.settings.totalRounds}
      />

      {/* Score Breakdowns */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <ScoreBreakdown
          score={latestResult.team1Score}
          teamName={state.settings.team1Name}
          teamColor="blue"
        />
        <ScoreBreakdown
          score={latestResult.team2Score}
          teamName={state.settings.team2Name}
          teamColor="purple"
        />
      </div>

      {/* Peer Feedback */}
      {(latestResult.team1Score.feedback || latestResult.team2Score.feedback) && (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {latestResult.team1Score.feedback && latestResult.team1Score.feedback !== 'No feedback provided.' && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-sm font-semibold text-purple-400 mb-2">
                Feedback from {state.settings.team2Name}
              </h3>
              <p className="text-slate-300 text-sm">{latestResult.team1Score.feedback}</p>
            </div>
          )}
          {latestResult.team2Score.feedback && latestResult.team2Score.feedback !== 'No feedback provided.' && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">
                Feedback from {state.settings.team1Name}
              </h3>
              <p className="text-slate-300 text-sm">{latestResult.team2Score.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Prompts (Collapsed) */}
      <details className="mt-6 group">
        <summary className="cursor-pointer text-slate-400 hover:text-white transition-colors">
          View Submitted Prompts
        </summary>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">{state.settings.team1Name}'s Prompt</h4>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{latestResult.team1Prompt}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">{state.settings.team2Name}'s Prompt</h4>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{latestResult.team2Prompt}</p>
          </div>
        </div>
      </details>

      {/* Gold Standard Example */}
      <Card className="mt-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30">
        <button
          onClick={() => setShowGoldStandard(!showGoldStandard)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-lg font-bold text-amber-400">Gold Standard Example</h3>
              <p className="text-sm text-slate-400">See what a high-scoring prompt looks like for this scenario</p>
            </div>
          </div>
          <span className={`text-slate-400 transition-transform ${showGoldStandard ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showGoldStandard && (
          <div className="mt-4 pt-4 border-t border-amber-500/20">
            {/* Scenario Context */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="text-sm font-semibold text-slate-400 mb-1">Scenario</h4>
              <p className="text-white font-medium mb-2">{latestResult.scenario.title}</p>
              <p className="text-slate-300 text-sm">{latestResult.scenario.situation}</p>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-amber-300 mb-3">Compare Your Prompts</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {/* Team 1's Prompt */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-sm font-medium">{state.settings.team1Name}</span>
                    <span className="text-slate-500 text-xs">{latestResult.team1Score.total} pts</span>
                  </div>
                  <p className="text-slate-300 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {latestResult.team1Prompt}
                  </p>
                </div>

                {/* Team 2's Prompt */}
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 text-sm font-medium">{state.settings.team2Name}</span>
                    <span className="text-slate-500 text-xs">{latestResult.team2Score.total} pts</span>
                  </div>
                  <p className="text-slate-300 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {latestResult.team2Prompt}
                  </p>
                </div>

                {/* Gold Standard */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-400 text-sm font-medium">Gold Standard</span>
                    <span className="text-amber-500 text-xs">100 pts</span>
                  </div>
                  <p className="text-slate-300 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">
                    {latestResult.scenario.examplePrompt.prompt}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown by Criteria */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-amber-300">Why This Prompt Scores Well</h4>

              <div className="grid gap-3">
                <div className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-semibold text-sm">Context</span>
                    <span className="text-slate-500 text-xs">(Environmental/situational detail)</span>
                  </div>
                  <p className="text-slate-300 text-sm">{latestResult.scenario.examplePrompt.breakdown.context}</p>
                </div>

                <div className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 font-semibold text-sm">Task Clarity</span>
                    <span className="text-slate-500 text-xs">(Specific and unambiguous ask)</span>
                  </div>
                  <p className="text-slate-300 text-sm">{latestResult.scenario.examplePrompt.breakdown.taskClarity}</p>
                </div>

                <div className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-400 font-semibold text-sm">Constraints & Format</span>
                    <span className="text-slate-500 text-xs">(Output shaping)</span>
                  </div>
                  <p className="text-slate-300 text-sm">{latestResult.scenario.examplePrompt.breakdown.constraintsFormat}</p>
                </div>

                <div className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 font-semibold text-sm">AUP Awareness</span>
                    <span className="text-slate-500 text-xs">(Data sanitization)</span>
                  </div>
                  <p className="text-slate-300 text-sm">{latestResult.scenario.examplePrompt.breakdown.aupAwareness}</p>
                </div>

                <div className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-rose-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-rose-400 font-semibold text-sm">Practical Value</span>
                    <span className="text-slate-500 text-xs">(Would the response be useful?)</span>
                  </div>
                  <p className="text-slate-300 text-sm">{latestResult.scenario.examplePrompt.breakdown.practicalValue}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        {isLastRound ? (
          <Button size="lg" onClick={handleViewFinal}>
            View Final Results
          </Button>
        ) : (
          <Button size="lg" onClick={handleNextRound}>
            Next Round
          </Button>
        )}
      </div>
    </div>
  );
}
