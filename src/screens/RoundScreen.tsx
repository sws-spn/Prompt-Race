import { useState, useCallback } from 'react';
import { Button, Card, TextArea, Timer } from '../components/ui';
import { useGame } from '../context/GameContext';

const MIN_CHARS = 20;

export function RoundScreen() {
  const { state, dispatch } = useGame();
  const [prompt, setPrompt] = useState('');
  const [timerKey, setTimerKey] = useState(0);

  const scenario = state.scenarios[state.currentRound - 1];
  const currentTeamName = state.currentTeam === 1 ? state.settings.team1Name : state.settings.team2Name;
  const isValidLength = prompt.length >= MIN_CHARS;

  const handleSubmit = useCallback(() => {
    if (!isValidLength) return;
    dispatch({ type: 'SUBMIT_PROMPT', payload: prompt });
    setPrompt('');
    setTimerKey((k) => k + 1); // Reset timer for team 2
  }, [dispatch, isValidLength, prompt]);

  const handleTimeUp = useCallback(() => {
    // Auto-submit when time runs out
    dispatch({ type: 'SUBMIT_PROMPT', payload: prompt || '[No response submitted]' });
    setPrompt('');
    setTimerKey((k) => k + 1);
  }, [dispatch, prompt]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'troubleshooting': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'client-communication': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'documentation': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'research': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            Round {state.currentRound} of {state.settings.totalRounds}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm border ${getCategoryColor(scenario.category)}`}>
            {getCategoryLabel(scenario.category)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-slate-700 text-slate-300">
            Difficulty {scenario.difficulty}
          </span>
        </div>
        {state.settings.timeLimit && (
          <Timer
            key={timerKey}
            seconds={state.settings.timeLimit}
            onComplete={handleTimeUp}
            isRunning={true}
          />
        )}
      </div>

      {/* Current Team Indicator */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-blue-400 font-semibold">{currentTeamName}'s Turn</span>
        </div>
      </div>

      {/* Scenario Card */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-white mb-3">{scenario.title}</h2>
        <p className="text-slate-300 leading-relaxed mb-4">{scenario.situation}</p>
        {scenario.roleHint && (
          <p className="text-sm text-slate-400 italic">
            Hint: {scenario.roleHint}
          </p>
        )}
      </Card>

      {/* Prompt Instructions */}
      <div className="mb-4">
        <p className="text-slate-400 text-sm">
          Write a prompt to an AI assistant that would help address this scenario.
          Your prompt will be scored on context, clarity, constraints, AUP awareness, and practical value.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="flex-1 flex flex-col">
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="flex-1 min-h-[200px]"
          charCount={prompt.length}
          minChars={MIN_CHARS}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex items-center justify-end gap-4">
        {!isValidLength && (
          <span className="text-amber-400 text-sm">
            {MIN_CHARS - prompt.length} more characters needed
          </span>
        )}
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!isValidLength}
        >
          Submit Prompt
        </Button>
      </div>

      {/* Pass-and-Play Instructions */}
      {state.currentTeam === 1 && (
        <p className="text-center text-slate-500 text-sm mt-4">
          After {state.settings.team1Name} submits, the screen will clear for {state.settings.team2Name}.
        </p>
      )}
    </div>
  );
}
