import { useState, useCallback } from 'react';
import { Button, Card, TextArea, Timer } from '../components/ui';
import { useGame } from '../context/GameContext';

const MIN_CHARS = 20;

export function PracticePlayingScreen() {
  const { state, dispatch } = useGame();
  const [prompt, setPrompt] = useState('');

  const scenario = state.scenarios[state.currentRound - 1];
  const isValidLength = prompt.length >= MIN_CHARS;

  const handleSubmit = useCallback(() => {
    if (!isValidLength) return;
    dispatch({ type: 'SUBMIT_PRACTICE_PROMPT', payload: prompt });
  }, [dispatch, isValidLength, prompt]);

  const handleTimeUp = useCallback(() => {
    dispatch({ type: 'SUBMIT_PRACTICE_PROMPT', payload: prompt || '[No response submitted]' });
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
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-400 font-semibold">Practice Mode</span>
          </div>
          <span className="text-slate-400">
            Scenario {state.currentRound} of {state.settings.totalRounds}
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
            seconds={state.settings.timeLimit}
            onComplete={handleTimeUp}
            isRunning={true}
          />
        )}
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

      {/* Hints (Collapsible) */}
      <details className="mb-4 group">
        <summary className="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
          <span className="text-lg">💡</span>
          <span className="text-sm font-medium">Need hints? Click to reveal tips for this scenario</span>
          <span className="text-xs text-slate-500 group-open:hidden">(won't affect your score)</span>
        </summary>
        <div className="mt-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-amber-300 text-sm font-medium mb-2">Consider including:</p>
          <ul className="space-y-1">
            {scenario.idealElements.map((element, index) => (
              <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>{element}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {/* Prompt Instructions */}
      <div className="mb-4">
        <p className="text-slate-400 text-sm">
          Write a prompt to an AI assistant that would help address this scenario.
          After submitting, you'll score your own prompt and see the gold standard.
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
          Submit & Score
        </Button>
      </div>
    </div>
  );
}
