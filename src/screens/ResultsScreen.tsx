import { Button } from '../components/ui';
import { RaceTrack } from '../components/RaceTrack';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { useGame } from '../context/GameContext';

export function ResultsScreen() {
  const { state, dispatch } = useGame();

  const latestResult = state.roundResults[state.roundResults.length - 1];
  const isLastRound = state.currentRound >= state.settings.totalRounds;

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
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-slate-400">
          Round {state.currentRound} of {state.settings.totalRounds}
        </span>
        <h1 className="text-3xl font-bold text-white mt-2">
          {isTie ? "It's a Tie!" : team1Won ? `${state.settings.team1Name} Takes the Lead!` : `${state.settings.team2Name} Takes the Lead!`}
        </h1>
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
