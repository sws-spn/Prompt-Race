import { useState } from 'react';
import { Button, Card } from '../components/ui';
import { useGame } from '../context/GameContext';
import type { TeamScore } from '../types';

const CRITERIA = [
  {
    key: 'context',
    label: 'Context',
    shortDesc: 'Environmental and situational detail provided',
    fullDesc: 'Did the prompt provide sufficient environmental and situational detail? Does the AI have what it needs to give a targeted response?',
  },
  {
    key: 'taskClarity',
    label: 'Task Clarity',
    shortDesc: 'Specific and unambiguous ask',
    fullDesc: 'Is the ask specific and unambiguous? Would the AI know exactly what deliverable to produce?',
  },
  {
    key: 'constraintsFormat',
    label: 'Constraints & Format',
    shortDesc: 'Output shaping (format, tone, audience)',
    fullDesc: 'Did the prompt shape the output? Consider format, tone, audience, length, and structure specifications.',
  },
  {
    key: 'aupAwareness',
    label: 'AUP Awareness',
    shortDesc: 'Data sanitized, appropriate use',
    fullDesc: 'Is client data sanitized or generic? Does the prompt avoid including real names, emails, IPs, or sensitive information?',
  },
  {
    key: 'practicalValue',
    label: 'Practical Value',
    shortDesc: 'Would the AI response be useful?',
    fullDesc: 'If an AI received this prompt, would the response actually be useful in the real scenario?',
  },
] as const;

type CriteriaKey = typeof CRITERIA[number]['key'];

export function PeerJudgingScreen() {
  const { state, dispatch } = useGame();
  const [scores, setScores] = useState<Record<CriteriaKey, number>>({
    context: 10,
    taskClarity: 10,
    constraintsFormat: 10,
    aupAwareness: 10,
    practicalValue: 10,
  });
  const [feedback, setFeedback] = useState('');

  const scenario = state.scenarios[state.currentRound - 1];
  const judgingTeamName = state.judgingTeam === 1 ? state.settings.team1Name : state.settings.team2Name;
  const targetTeamName = state.judgingTeam === 1 ? state.settings.team2Name : state.settings.team1Name;
  const promptToScore = state.judgingTeam === 1 ? state.team2Prompt : state.team1Prompt;

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
      feedback: feedback || 'No feedback provided.',
    };

    dispatch({ type: 'SUBMIT_PEER_SCORE', payload: teamScore });

    // Reset for next judge
    setScores({
      context: 10,
      taskClarity: 10,
      constraintsFormat: 10,
      aupAwareness: 10,
      practicalValue: 10,
    });
    setFeedback('');
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
        <span className="text-slate-400">
          Round {state.currentRound} of {state.settings.totalRounds}
        </span>
        <h1 className="text-2xl font-bold text-white mt-2">Peer Judging</h1>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full">
          <span className="text-purple-400 font-semibold">
            {judgingTeamName} is scoring {targetTeamName}'s prompt
          </span>
        </div>
      </div>

      {/* Scenario Reminder */}
      <Card className="mb-4 bg-slate-800/50">
        <h3 className="text-sm font-semibold text-slate-400 mb-1">Scenario</h3>
        <p className="text-white">{scenario.title}</p>
      </Card>

      {/* Prompt to Score */}
      <Card className="mb-6 border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">
          {targetTeamName}'s Prompt
        </h3>
        <p className="text-white whitespace-pre-wrap bg-slate-900 p-4 rounded-lg text-sm">
          {promptToScore}
        </p>
      </Card>

      {/* Scoring Guide */}
      <Card className="mb-4 bg-slate-800/50">
        <details className="group">
          <summary className="cursor-pointer flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-400">Scoring Guide</h3>
            <span className="text-slate-500 text-xs group-open:hidden">Click to expand</span>
          </summary>
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
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
        </details>
      </Card>

      {/* Scoring Sliders */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Score Each Criteria</h3>
          <div className="text-2xl font-bold">
            <span className={getScoreColor(total)}>{total}</span>
            <span className="text-slate-500">/100</span>
          </div>
        </div>

        <div className="space-y-6">
          {CRITERIA.map(({ key, label, fullDesc }) => (
            <div key={key} className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <span className="text-white font-medium">{label}</span>
                  <p className="text-slate-400 text-sm mt-1">{fullDesc}</p>
                </div>
                <span className={`text-2xl font-bold ml-4 ${getScoreColor(scores[key])}`}>
                  {scores[key]}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-slate-500 text-sm w-4">0</span>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={scores[key]}
                  onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                  className="flex-1 accent-blue-500 h-2"
                />
                <span className="text-slate-500 text-sm w-6">20</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feedback */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-2">
          Feedback (optional)
        </h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What could they improve? What did they do well?"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
        />
      </Card>

      {/* Submit */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handleSubmit}>
          Submit Score
        </Button>
      </div>

      {/* Pass device prompt */}
      {state.judgingTeam === 1 && (
        <p className="text-center text-slate-500 text-sm mt-4">
          After scoring, pass the device to {state.settings.team2Name} to score {state.settings.team1Name}'s prompt.
        </p>
      )}
    </div>
  );
}
