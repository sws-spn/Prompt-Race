import { useState } from 'react';
import { Button, Card } from '../components/ui';
import { useGame } from '../context/GameContext';
import type { TeamScore } from '../types';

const CRITERIA = [
  {
    key: 'context',
    label: 'Context',
    fullDesc: 'Did you provide sufficient environmental and situational detail?',
    whyMatters: 'Without context, AI gives generic answers. Including OS version, error codes, and environment details leads to specific, actionable solutions.',
    icon: '📋',
  },
  {
    key: 'taskClarity',
    label: 'Task Clarity',
    fullDesc: 'Is your ask specific and unambiguous?',
    whyMatters: 'Vague asks get vague answers. "Help me fix this" vs "Give me 5 troubleshooting steps" - clarity determines output quality.',
    icon: '🎯',
  },
  {
    key: 'constraintsFormat',
    label: 'Constraints & Format',
    fullDesc: 'Did you shape the output with format, tone, or audience?',
    whyMatters: 'Format requests save time. "Bullet points for a tech" vs "paragraph for an executive" - the right format means less editing.',
    icon: '📐',
  },
  {
    key: 'aupAwareness',
    label: 'AUP Awareness',
    fullDesc: 'Is client data sanitized or generic?',
    whyMatters: 'Real client data in AI prompts risks privacy violations. Always use [CLIENT], [USER@DOMAIN], or [IP_ADDRESS] placeholders.',
    icon: '🛡️',
  },
  {
    key: 'practicalValue',
    label: 'Practical Value',
    fullDesc: 'Would the AI response actually be useful?',
    whyMatters: 'A technically correct prompt that produces unusable output wastes time. Think: "Can I actually use this response?"',
    icon: '⚡',
  },
] as const;

type CriteriaKey = typeof CRITERIA[number]['key'];

export function PracticeScoringScreen() {
  const { state, dispatch } = useGame();
  const [scores, setScores] = useState<Record<CriteriaKey, number>>({
    context: 10,
    taskClarity: 10,
    constraintsFormat: 10,
    aupAwareness: 10,
    practicalValue: 10,
  });

  const scenario = state.scenarios[state.currentRound - 1];
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (key: CriteriaKey, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const teamScore: TeamScore = {
      context: scores.context,
      taskClarity: scores.taskClarity,
      constraintsFormat: scores.constraintsFormat,
      aupAwareness: scores.aupAwareness,
      practicalValue: scores.practicalValue,
      total,
      feedback: '',
    };

    dispatch({ type: 'SUBMIT_PRACTICE_SCORE', payload: teamScore });
  };

  const getScoreColor = (score: number) => {
    if (score >= 15) return 'text-green-400';
    if (score >= 10) return 'text-blue-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-2">
          <span className="text-emerald-400 font-semibold">Practice Mode</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-2">Self-Assessment</h1>
        <p className="text-slate-400 mt-1">Be honest! Rate your prompt on each criterion.</p>
      </div>

      {/* Scenario Reminder */}
      <Card className="mb-4 bg-slate-800/50">
        <h3 className="text-sm font-semibold text-slate-400 mb-1">Scenario</h3>
        <p className="text-white">{scenario.title}</p>
      </Card>

      {/* Your Prompt */}
      <Card className="mb-6 border-emerald-500/30">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">Your Prompt</h3>
        <p className="text-white whitespace-pre-wrap bg-slate-900 p-4 rounded-lg text-sm">
          {state.practicePrompt}
        </p>
      </Card>

      {/* Scoring Guide */}
      <Card className="mb-4 bg-slate-800/50">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-red-500/10 rounded">
            <span className="text-red-400 font-bold">0-4</span>
            <p className="text-slate-400">Poor</p>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded">
            <span className="text-amber-400 font-bold">5-9</span>
            <p className="text-slate-400">Needs work</p>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded">
            <span className="text-blue-400 font-bold">10-14</span>
            <p className="text-slate-400">Good</p>
          </div>
          <div className="text-center p-2 bg-green-500/10 rounded">
            <span className="text-green-400 font-bold">15-20</span>
            <p className="text-slate-400">Excellent</p>
          </div>
        </div>
      </Card>

      {/* Scoring Sliders */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Score Your Prompt</h3>
          <div className="text-2xl font-bold">
            <span className={getScoreColor(total)}>{total}</span>
            <span className="text-slate-500">/100</span>
          </div>
        </div>

        <div className="space-y-6">
          {CRITERIA.map(({ key, label, fullDesc, whyMatters, icon }) => (
            <div key={key} className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-white font-medium">{label}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{fullDesc}</p>
                </div>
                <span className={`text-2xl font-bold ml-4 ${getScoreColor(scores[key])}`}>
                  {scores[key]}
                </span>
              </div>
              {/* Why This Matters */}
              <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
                <span className="text-blue-400 font-medium">Why it matters: </span>
                <span className="text-slate-300">{whyMatters}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-slate-500 text-sm w-4">0</span>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={scores[key]}
                  onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                  className="flex-1 accent-emerald-500 h-2"
                />
                <span className="text-slate-500 text-sm w-6">20</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handleSubmit}>
          See Results & Gold Standard
        </Button>
      </div>
    </div>
  );
}
