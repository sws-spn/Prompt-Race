import { useState } from 'react';
import { Button, Card, Input } from '../components/ui';
import { useGame } from '../context/GameContext';
import { scenarios } from '../data/scenarios';
import type { Category, GameSettings } from '../types';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'client-communication', label: 'Client Communication' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'research', label: 'Research' },
];

const TIME_OPTIONS = [
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
  { value: null, label: 'Untimed' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GameSetup() {
  const { dispatch } = useGame();
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'versus',
    team1Name: '',
    team2Name: '',
    totalRounds: 7,
    timeLimit: 180,
    categories: ['troubleshooting', 'client-communication', 'documentation', 'research'],
    difficultyMix: 'all',
  });

  const handleCategoryToggle = (category: Category) => {
    const current = settings.categories;
    if (current.includes(category)) {
      if (current.length > 1) {
        setSettings({ ...settings, categories: current.filter((c) => c !== category) });
      }
    } else {
      setSettings({ ...settings, categories: [...current, category] });
    }
  };

  const handleStartGame = () => {
    // Filter and shuffle scenarios
    let filtered = scenarios.filter((s) => settings.categories.includes(s.category));

    if (settings.difficultyMix === 'easy') {
      filtered = filtered.filter((s) => s.difficulty === 1);
    } else if (settings.difficultyMix === 'hard') {
      filtered = filtered.filter((s) => s.difficulty === 3);
    }

    const shuffled = shuffleArray(filtered).slice(0, settings.totalRounds);

    dispatch({
      type: 'START_GAME',
      payload: {
        settings: {
          ...settings,
          team1Name: settings.team1Name || 'Team 1',
          team2Name: settings.team2Name || 'Team 2',
        },
        scenarios: shuffled,
      },
    });
  };

  const isValid = settings.categories.length > 0;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Game Setup</h1>
          <p className="text-slate-400">Configure your match settings</p>
        </div>

        <div className="space-y-6">
          {/* Team Names */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Teams</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Team 1 Name"
                placeholder="Team 1"
                value={settings.team1Name}
                onChange={(e) => setSettings({ ...settings, team1Name: e.target.value })}
              />
              <Input
                label="Team 2 Name"
                placeholder="Team 2"
                value={settings.team2Name}
                onChange={(e) => setSettings({ ...settings, team2Name: e.target.value })}
              />
            </div>
          </Card>

          {/* Rounds */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Rounds</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={3}
                max={15}
                value={settings.totalRounds}
                onChange={(e) => setSettings({ ...settings, totalRounds: Number(e.target.value) })}
                className="flex-1 accent-blue-500"
              />
              <span className="text-2xl font-bold text-white w-12 text-center">
                {settings.totalRounds}
              </span>
            </div>
          </Card>

          {/* Time Limit */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Time Limit per Round</h3>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSettings({ ...settings, timeLimit: opt.value })}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.timeLimit === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Scenario Categories</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.categories.includes(cat.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Difficulty */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Difficulty</h3>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Levels' },
                { value: 'easy', label: 'Easy Only' },
                { value: 'hard', label: 'Hard Only' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSettings({ ...settings, difficultyMix: opt.value as GameSettings['difficultyMix'] })}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.difficultyMix === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => dispatch({ type: 'RESET_GAME' })}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleStartGame}
              disabled={!isValid}
            >
              Start Race
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
