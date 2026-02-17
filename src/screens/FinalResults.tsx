import { useMemo, useState, useEffect } from 'react';
import { Button, Card } from '../components/ui';
import { RaceTrack } from '../components/RaceTrack';
import { Confetti } from '../components/Confetti';
import { useGame } from '../context/GameContext';
import { scenarios } from '../data/scenarios';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

import type { GameState, GameAction } from '../types';

// Practice Mode Final Results Component
function PracticeFinalResults({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<GameAction> }) {
  const [showConfetti, setShowConfetti] = useState(false);

  const totalScore = state.practiceResults.reduce((sum, r) => sum + r.score.total, 0);
  const averageScore = state.practiceResults.length > 0
    ? Math.round(totalScore / state.practiceResults.length)
    : 0;
  const bestScore = Math.max(...state.practiceResults.map(r => r.score.total), 0);
  const totalTime = state.practiceResults.reduce((sum, r) => sum + r.timeSpent, 0);

  // Calculate category averages
  const categoryTotals = state.practiceResults.reduce((acc, r) => ({
    context: acc.context + r.score.context,
    taskClarity: acc.taskClarity + r.score.taskClarity,
    constraintsFormat: acc.constraintsFormat + r.score.constraintsFormat,
    aupAwareness: acc.aupAwareness + r.score.aupAwareness,
    practicalValue: acc.practicalValue + r.score.practicalValue,
  }), { context: 0, taskClarity: 0, constraintsFormat: 0, aupAwareness: 0, practicalValue: 0 });

  const count = state.practiceResults.length || 1;
  const categoryAverages = {
    context: Math.round(categoryTotals.context / count),
    taskClarity: Math.round(categoryTotals.taskClarity / count),
    constraintsFormat: Math.round(categoryTotals.constraintsFormat / count),
    aupAwareness: Math.round(categoryTotals.aupAwareness / count),
    practicalValue: Math.round(categoryTotals.practicalValue / count),
  };

  // Find weakest category
  const categoryLabels: Record<string, string> = {
    context: 'Context',
    taskClarity: 'Task Clarity',
    constraintsFormat: 'Constraints & Format',
    aupAwareness: 'AUP Awareness',
    practicalValue: 'Practical Value',
  };
  const weakestKey = Object.entries(categoryAverages).reduce((a, b) => a[1] < b[1] ? a : b)[0];
  const strongestKey = Object.entries(categoryAverages).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  useEffect(() => {
    if (averageScore >= 70) {
      setShowConfetti(true);
    }
  }, [averageScore]);

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Outstanding!', emoji: '🏆' };
    if (score >= 80) return { label: 'Excellent!', emoji: '🌟' };
    if (score >= 70) return { label: 'Great job!', emoji: '👏' };
    if (score >= 60) return { label: 'Good work!', emoji: '👍' };
    if (score >= 50) return { label: 'Keep practicing!', emoji: '💪' };
    return { label: 'Room to grow', emoji: '📚' };
  };

  const scoreInfo = getScoreLabel(averageScore);

  const handleNewPractice = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full overflow-auto">
      <Confetti isActive={showConfetti} duration={5000} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-4">
          <span className="text-emerald-400 font-semibold">Practice Complete</span>
        </div>
        <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
        <h1 className="text-4xl font-bold text-white mb-2">{scoreInfo.label}</h1>
        <p className="text-slate-400">
          You completed {state.practiceResults.length} scenario{state.practiceResults.length !== 1 ? 's' : ''} in {Math.floor(totalTime / 60)}m {totalTime % 60}s
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-slate-400 text-sm mb-1">Average Score</p>
          <p className={`text-4xl font-bold ${averageScore >= 70 ? 'text-green-400' : averageScore >= 50 ? 'text-blue-400' : 'text-amber-400'}`}>
            {averageScore}
          </p>
          <p className="text-slate-500 text-xs">/100</p>
        </Card>
        <Card className="text-center">
          <p className="text-slate-400 text-sm mb-1">Best Score</p>
          <p className="text-4xl font-bold text-emerald-400">{bestScore}</p>
          <p className="text-slate-500 text-xs">/100</p>
        </Card>
        <Card className="text-center">
          <p className="text-slate-400 text-sm mb-1">Total Points</p>
          <p className="text-4xl font-bold text-white">{totalScore}</p>
          <p className="text-slate-500 text-xs">across {state.practiceResults.length} scenarios</p>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
        <div className="space-y-3">
          {[
            { key: 'context', label: 'Context', icon: '📋' },
            { key: 'taskClarity', label: 'Task Clarity', icon: '🎯' },
            { key: 'constraintsFormat', label: 'Constraints & Format', icon: '📐' },
            { key: 'aupAwareness', label: 'AUP Awareness', icon: '🛡️' },
            { key: 'practicalValue', label: 'Practical Value', icon: '⚡' },
          ].map(({ key, label, icon }) => {
            const avg = categoryAverages[key as keyof typeof categoryAverages];
            const isWeak = key === weakestKey;
            const isStrong = key === strongestKey;
            return (
              <div key={key} className="flex items-center gap-4">
                <span className="text-xl w-8">{icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 text-sm">{label}</span>
                    <span className={`text-sm font-medium ${avg >= 15 ? 'text-green-400' : avg >= 10 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {avg}/20
                      {isWeak && <span className="ml-2 text-amber-400 text-xs">← Focus here</span>}
                      {isStrong && <span className="ml-2 text-green-400 text-xs">← Strength!</span>}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${avg >= 15 ? 'bg-green-500' : avg >= 10 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${(avg / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Learning Insight */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h4 className="text-white font-semibold mb-1">Learning Insight</h4>
            <p className="text-slate-300 text-sm">
              Your strongest area is <span className="text-green-400 font-medium">{categoryLabels[strongestKey]}</span>.
              To improve, focus on <span className="text-amber-400 font-medium">{categoryLabels[weakestKey]}</span> -
              {weakestKey === 'context' && ' try including more environmental details like OS version, error codes, and user environment.'}
              {weakestKey === 'taskClarity' && ' be more specific about what output you need - lists, steps, explanations, etc.'}
              {weakestKey === 'constraintsFormat' && ' specify format, tone, length, and audience in your prompts.'}
              {weakestKey === 'aupAwareness' && ' remember to sanitize client data using placeholders like [CLIENT] or [USER@DOMAIN].'}
              {weakestKey === 'practicalValue' && ' think about whether the AI response would actually solve the real-world problem.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Round-by-Round */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Scenario Breakdown</h3>
        <div className="space-y-2">
          {state.practiceResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm">#{index + 1}</span>
                <span className="text-slate-300">{result.scenario.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 text-sm">{result.timeSpent}s</span>
                <span className={`font-bold ${result.score.total >= 70 ? 'text-green-400' : result.score.total >= 50 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {result.score.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={handleNewPractice}>
          Practice Again
        </Button>
      </div>
    </div>
  );
}

export function FinalResults() {
  const { state, dispatch } = useGame();

  // Check if this is practice mode
  const isPracticeMode = state.settings.mode === 'practice';

  // Practice mode final results
  if (isPracticeMode) {
    return <PracticeFinalResults state={state} dispatch={dispatch} />;
  }

  const { winner, mvpPrompt, team1Weakness, team2Weakness } = useMemo(() => {
    // Determine winner
    let winner: 'team1' | 'team2' | 'tie' = 'tie';
    if (state.team1Position > state.team2Position) winner = 'team1';
    else if (state.team2Position > state.team1Position) winner = 'team2';

    // Find MVP prompt (highest single score)
    let mvpPrompt = {
      team: '',
      round: 0,
      score: 0,
      prompt: '',
      scenario: '',
    };

    // Track category scores for weakness analysis
    const team1Categories = { context: 0, taskClarity: 0, constraintsFormat: 0, aupAwareness: 0, practicalValue: 0 };
    const team2Categories = { context: 0, taskClarity: 0, constraintsFormat: 0, aupAwareness: 0, practicalValue: 0 };

    state.roundResults.forEach((result) => {
      // Check team 1
      if (result.team1Score.total > mvpPrompt.score) {
        mvpPrompt = {
          team: state.settings.team1Name,
          round: result.roundNumber,
          score: result.team1Score.total,
          prompt: result.team1Prompt,
          scenario: result.scenario.title,
        };
      }
      // Check team 2
      if (result.team2Score.total > mvpPrompt.score) {
        mvpPrompt = {
          team: state.settings.team2Name,
          round: result.roundNumber,
          score: result.team2Score.total,
          prompt: result.team2Prompt,
          scenario: result.scenario.title,
        };
      }

      // Accumulate category scores
      team1Categories.context += result.team1Score.context;
      team1Categories.taskClarity += result.team1Score.taskClarity;
      team1Categories.constraintsFormat += result.team1Score.constraintsFormat;
      team1Categories.aupAwareness += result.team1Score.aupAwareness;
      team1Categories.practicalValue += result.team1Score.practicalValue;

      team2Categories.context += result.team2Score.context;
      team2Categories.taskClarity += result.team2Score.taskClarity;
      team2Categories.constraintsFormat += result.team2Score.constraintsFormat;
      team2Categories.aupAwareness += result.team2Score.aupAwareness;
      team2Categories.practicalValue += result.team2Score.practicalValue;
    });

    // Find weakest category for each team
    const categoryLabels: Record<string, string> = {
      context: 'providing context',
      taskClarity: 'task clarity',
      constraintsFormat: 'specifying constraints and format',
      aupAwareness: 'AUP awareness',
      practicalValue: 'practical value',
    };

    const team1WeakestKey = Object.entries(team1Categories).reduce((a, b) =>
      a[1] < b[1] ? a : b
    )[0];
    const team2WeakestKey = Object.entries(team2Categories).reduce((a, b) =>
      a[1] < b[1] ? a : b
    )[0];

    return {
      winner,
      mvpPrompt,
      team1Weakness: categoryLabels[team1WeakestKey],
      team2Weakness: categoryLabels[team2WeakestKey],
    };
  }, [state]);

  const winnerName =
    winner === 'team1'
      ? state.settings.team1Name
      : winner === 'team2'
      ? state.settings.team2Name
      : null;

  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti on mount if there's a winner
  useEffect(() => {
    if (winner !== 'tie') {
      setShowConfetti(true);
    }
  }, [winner]);

  const handlePlayAgain = () => {
    dispatch({ type: 'GO_TO_SETUP' });
  };

  const handleQuickRematch = () => {
    // Reshuffle scenarios with same settings
    const settings = state.settings;
    let filtered = scenarios.filter((s) => settings.categories.includes(s.category));

    if (settings.difficultyMix === 'easy') {
      filtered = filtered.filter((s) => s.difficulty === 1);
    } else if (settings.difficultyMix === 'hard') {
      filtered = filtered.filter((s) => s.difficulty >= 2);
    }

    const shuffled = shuffleArray(filtered);
    const selected = shuffled.slice(0, settings.totalRounds);

    dispatch({
      type: 'START_GAME',
      payload: { settings, scenarios: selected },
    });
  };

  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const generateExportText = () => {
    let text = `# Prompt Race Results - Test These Prompts!\n\n`;
    text += `Below are the scenarios and prompts from a Prompt Race game. For each scenario, try both prompts and see which one produces a better AI response.\n\n`;

    text += `## Scoring Rubric\n\n`;
    text += `Each prompt was scored on 5 criteria (0-20 points each, 100 total):\n\n`;
    text += `| Criteria | Description |\n`;
    text += `|----------|-------------|\n`;
    text += `| **Context** | Did the prompt provide sufficient environmental and situational detail? Does the AI have what it needs to give a targeted response? |\n`;
    text += `| **Task Clarity** | Is the ask specific and unambiguous? Would the AI know exactly what deliverable to produce? |\n`;
    text += `| **Constraints & Format** | Did the prompt shape the output? Consider format, tone, audience, length, and structure specifications. |\n`;
    text += `| **AUP Awareness** | Is client data sanitized or generic? Does the prompt avoid including real names, emails, IPs, or sensitive information? |\n`;
    text += `| **Practical Value** | If an AI received this prompt, would the response actually be useful in the real scenario? |\n\n`;

    text += `**Scoring Guide:** 0-4 = Poor, 5-9 = Needs work, 10-14 = Good, 15-20 = Excellent\n\n`;
    text += `---\n\n`;

    state.roundResults.forEach((result, index) => {
      text += `## Round ${index + 1}: ${result.scenario.title}\n\n`;
      text += `**Scenario:**\n${result.scenario.situation}\n\n`;
      text += `---\n\n`;

      text += `### ${state.settings.team1Name}'s Prompt (Total: ${result.team1Score.total}/100)\n\n`;
      text += `**Scores:** Context: ${result.team1Score.context}/20 | Task Clarity: ${result.team1Score.taskClarity}/20 | Constraints: ${result.team1Score.constraintsFormat}/20 | AUP: ${result.team1Score.aupAwareness}/20 | Practical: ${result.team1Score.practicalValue}/20\n\n`;
      text += `**Prompt:**\n${result.team1Prompt}\n\n`;
      text += `---\n\n`;

      text += `### ${state.settings.team2Name}'s Prompt (Total: ${result.team2Score.total}/100)\n\n`;
      text += `**Scores:** Context: ${result.team2Score.context}/20 | Task Clarity: ${result.team2Score.taskClarity}/20 | Constraints: ${result.team2Score.constraintsFormat}/20 | AUP: ${result.team2Score.aupAwareness}/20 | Practical: ${result.team2Score.practicalValue}/20\n\n`;
      text += `**Prompt:**\n${result.team2Prompt}\n\n`;
      text += `---\n\n`;
    });

    return text;
  };

  const generateShareCard = () => {
    const winEmoji = winner === 'tie' ? '🤝' : '🏆';
    const winText = winner === 'tie'
      ? "It's a tie!"
      : `${winnerName} wins!`;

    let card = `┌─────────────────────────────────┐\n`;
    card += `│      🏎️ PROMPT RACE RESULTS      │\n`;
    card += `├─────────────────────────────────┤\n`;
    card += `│                                 │\n`;
    card += `│  ${winEmoji} ${winText.padEnd(27)} │\n`;
    card += `│                                 │\n`;
    card += `│  ${state.settings.team1Name.padEnd(15)} ${String(state.team1Position).padStart(4)} pts  │\n`;
    card += `│  ${state.settings.team2Name.padEnd(15)} ${String(state.team2Position).padStart(4)} pts  │\n`;
    card += `│                                 │\n`;
    card += `│  ──────────────────────────     │\n`;
    card += `│  Rounds: ${state.settings.totalRounds}                      │\n`;
    card += `│  MVP: ${mvpPrompt.team} (${mvpPrompt.score} pts)      │\n`;
    card += `│                                 │\n`;
    card += `└─────────────────────────────────┘\n`;
    card += `\n🎮 Play at: prompt-race.vercel.app`;

    return card;
  };

  const [cardCopied, setCardCopied] = useState(false);

  const handleCopyShareCard = async () => {
    const card = generateShareCard();
    await navigator.clipboard.writeText(card);
    setCardCopied(true);
    setTimeout(() => setCardCopied(false), 2000);
  };

  const handleCopyAll = async () => {
    const text = generateExportText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full overflow-auto">
      {/* Confetti Celebration */}
      <Confetti isActive={showConfetti} duration={5000} />

      {/* Winner Announcement */}
      <div className="text-center mb-8">
        {winner === 'tie' ? (
          <>
            <div className="text-6xl mb-4">🤝</div>
            <h1 className="text-4xl font-bold text-white mb-2">It's a Tie!</h1>
            <p className="text-slate-400">Both teams performed equally well</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-white mb-2">{winnerName} Wins!</h1>
            <p className="text-slate-400">Congratulations on your victory</p>
          </>
        )}

        {/* Share Button */}
        <button
          onClick={handleCopyShareCard}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          {cardCopied ? (
            <>
              <span>✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Share Results</span>
            </>
          )}
        </button>
      </div>

      {/* Final Race Track */}
      <RaceTrack
        team1Name={state.settings.team1Name}
        team2Name={state.settings.team2Name}
        team1Position={state.team1Position}
        team2Position={state.team2Position}
        totalRounds={state.settings.totalRounds}
        showFinishAnimation={true}
      />

      {/* Final Scores */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className={winner === 'team1' ? 'ring-2 ring-yellow-500' : ''}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-blue-600" />
            <h3 className="text-xl font-bold text-white">{state.settings.team1Name}</h3>
            {winner === 'team1' && <span className="text-yellow-400">🏆</span>}
          </div>
          <div className="text-4xl font-bold text-blue-400 mb-2">{state.team1Position}</div>
          <p className="text-slate-400 text-sm">Total Points</p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Area to improve: <span className="text-white">{team1Weakness}</span>
            </p>
          </div>
        </Card>

        <Card className={winner === 'team2' ? 'ring-2 ring-yellow-500' : ''}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-purple-600" />
            <h3 className="text-xl font-bold text-white">{state.settings.team2Name}</h3>
            {winner === 'team2' && <span className="text-yellow-400">🏆</span>}
          </div>
          <div className="text-4xl font-bold text-purple-400 mb-2">{state.team2Position}</div>
          <p className="text-slate-400 text-sm">Total Points</p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Area to improve: <span className="text-white">{team2Weakness}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* MVP Prompt */}
      <Card className="mt-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">⭐</span>
          <h3 className="text-lg font-bold text-yellow-400">MVP Prompt</h3>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          {mvpPrompt.team} · Round {mvpPrompt.round} · {mvpPrompt.scenario} · {mvpPrompt.score} points
        </p>
        <p className="text-white text-sm whitespace-pre-wrap bg-slate-800/50 p-4 rounded-lg">
          {mvpPrompt.prompt}
        </p>
      </Card>

      {/* Round-by-Round Breakdown */}
      <Card className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4">Round-by-Round</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="text-left py-2 pr-4">Round</th>
                <th className="text-left py-2 pr-4">Scenario</th>
                <th className="text-right py-2 pr-4">{state.settings.team1Name}</th>
                <th className="text-right py-2">{state.settings.team2Name}</th>
              </tr>
            </thead>
            <tbody>
              {state.roundResults.map((result, index) => (
                <tr key={index} className="border-b border-slate-800">
                  <td className="py-2 pr-4 text-slate-300">{index + 1}</td>
                  <td className="py-2 pr-4 text-slate-300">{result.scenario.title}</td>
                  <td className={`py-2 pr-4 text-right font-medium ${
                    result.team1Score.total > result.team2Score.total ? 'text-blue-400' : 'text-slate-400'
                  }`}>
                    {result.team1Score.total}
                  </td>
                  <td className={`py-2 text-right font-medium ${
                    result.team2Score.total > result.team1Score.total ? 'text-purple-400' : 'text-slate-400'
                  }`}>
                    {result.team2Score.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Prompts for Testing */}
      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Test Your Prompts</h3>
            <p className="text-sm text-slate-400">Copy all scenarios and prompts to test in Claude</p>
          </div>
          <Button
            variant={copied ? 'primary' : 'secondary'}
            onClick={handleCopyAll}
          >
            {copied ? 'Copied!' : 'Copy All'}
          </Button>
        </div>

        <details className="group">
          <summary className="cursor-pointer text-slate-400 hover:text-white transition-colors">
            Preview all scenarios and prompts
          </summary>
          <div className="mt-4 space-y-6 max-h-96 overflow-y-auto">
            {state.roundResults.map((result, index) => (
              <div key={index} className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  Round {index + 1}: {result.scenario.title}
                </h4>
                <p className="text-slate-400 text-sm mb-4">{result.scenario.situation}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-800 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 font-medium text-sm">{state.settings.team1Name}</span>
                      <span className="text-slate-500 text-xs">{result.team1Score.total} pts</span>
                    </div>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{result.team1Prompt}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-400 font-medium text-sm">{state.settings.team2Name}</span>
                      <span className="text-slate-500 text-xs">{result.team2Score.total} pts</span>
                    </div>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{result.team2Prompt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>
      </Card>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {/* Quick Rematch - Primary Action */}
        <Button
          size="lg"
          onClick={handleQuickRematch}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8"
        >
          ⚡ Quick Rematch (Same Teams, New Scenarios)
        </Button>

        {/* Secondary Actions */}
        <div className="flex gap-4">
          <Button variant="secondary" onClick={handlePlayAgain}>
            Change Settings
          </Button>
          <Button variant="secondary" onClick={handleNewGame}>
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
}
