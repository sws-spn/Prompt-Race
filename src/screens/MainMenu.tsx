import { useState, useMemo } from 'react';
import { Button, Card, Modal } from '../components/ui';
import { useGame } from '../context/GameContext';
import { scenarios } from '../data/scenarios';
import { getCustomScenarios } from '../lib/storage';
import type { Category } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function MainMenu() {
  const { dispatch } = useGame();
  const customScenarios = useMemo(() => getCustomScenarios(), []);
  const allScenarios = useMemo(() => [...scenarios, ...customScenarios], [customScenarios]);
  const [showRules, setShowRules] = useState(false);
  const [showPracticeSetup, setShowPracticeSetup] = useState(false);
  const [practiceCount, setPracticeCount] = useState(5);
  const [practiceCategories, setPracticeCategories] = useState<Category[]>([
    'troubleshooting', 'client-communication', 'documentation', 'research'
  ]);

  const handleStartGame = () => {
    dispatch({ type: 'GO_TO_SETUP' });
  };

  const handleStartPractice = () => {
    const filtered = allScenarios.filter(s => practiceCategories.includes(s.category));
    const shuffled = shuffleArray(filtered);
    const selected = shuffled.slice(0, practiceCount);

    dispatch({
      type: 'START_PRACTICE',
      payload: { scenarios: selected, categories: practiceCategories }
    });
  };

  const togglePracticeCategory = (cat: Category) => {
    if (practiceCategories.includes(cat)) {
      if (practiceCategories.length > 1) {
        setPracticeCategories(practiceCategories.filter(c => c !== cat));
      }
    } else {
      setPracticeCategories([...practiceCategories, cat]);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {/* Logo/Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">Prompt Race</h1>
          <p className="text-xl text-slate-400">
            Compete to craft the perfect prompt
          </p>
        </div>

        {/* How it works */}
        <Card className="mb-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. Two teams compete by writing prompts for the same scenario</p>
            <p>2. After both submit, prompts are revealed side-by-side</p>
            <p>3. Teams score each other using the rubric (peer judging)</p>
            <p>4. Higher scores move you further on the race track</p>
          </div>
        </Card>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 text-center hover:border-blue-500/50 transition-colors cursor-pointer" onClick={handleStartGame}>
            <div className="text-4xl mb-3">🏎️</div>
            <h3 className="text-xl font-bold text-white mb-2">Team Battle</h3>
            <p className="text-slate-400 text-sm mb-4">Two teams compete head-to-head with peer judging</p>
            <Button size="lg" className="w-full">Start Game</Button>
          </Card>

          <Card className="p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer" onClick={() => setShowPracticeSetup(true)}>
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Solo Practice</h3>
            <p className="text-slate-400 text-sm mb-4">Train on your own, self-score, and learn from examples</p>
            <Button size="lg" variant="secondary" className="w-full bg-emerald-600 hover:bg-emerald-700 border-emerald-600">Practice</Button>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button variant="secondary" onClick={() => setShowRules(true)}>
            View Scoring Rubric
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'GO_TO_HISTORY' })}>
            📊 History & Stats
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'GO_TO_ACHIEVEMENTS' })}>
            🏆 Achievements
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'GO_TO_CUSTOM_SCENARIOS' })}>
            Custom Scenarios
          </Button>
        </div>

        {/* Practice Setup Modal */}
        <Modal isOpen={showPracticeSetup} onClose={() => setShowPracticeSetup(false)} title="Practice Mode Setup">
          <div className="space-y-6 text-left">
            {/* Number of Scenarios */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Number of Scenarios
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setPracticeCount(num)}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      practiceCount === num
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Categories (select at least one)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'troubleshooting' as Category, label: 'Troubleshooting', color: 'red' },
                  { id: 'client-communication' as Category, label: 'Client Comms', color: 'blue' },
                  { id: 'documentation' as Category, label: 'Documentation', color: 'green' },
                  { id: 'research' as Category, label: 'Research', color: 'purple' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => togglePracticeCategory(cat.id)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                      practiceCategories.includes(cat.id)
                        ? `bg-${cat.color}-500/20 border-${cat.color}-500/50 text-${cat.color}-400`
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              size="lg"
              onClick={handleStartPractice}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Start Practice ({practiceCount} scenarios)
            </Button>
          </div>
        </Modal>

        {/* Rules Modal */}
        <Modal isOpen={showRules} onClose={() => setShowRules(false)} title="Scoring Rubric">
          <div className="space-y-4 text-left text-slate-300">
            <p className="text-sm text-slate-400 mb-4">
              Each prompt is scored on 5 criteria, 0-20 points each (100 total).
            </p>

            <section>
              <h4 className="font-semibold text-blue-400 mb-1">Context (0-20)</h4>
              <p className="text-sm">
                Did the prompt provide sufficient environmental and situational detail?
                Does the AI have what it needs to give a targeted response?
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-blue-400 mb-1">Task Clarity (0-20)</h4>
              <p className="text-sm">
                Is the ask specific and unambiguous? Would the AI know exactly what
                deliverable to produce?
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-blue-400 mb-1">Constraints & Format (0-20)</h4>
              <p className="text-sm">
                Did the prompt shape the output? Consider format, tone, audience,
                length, and structure specifications.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-blue-400 mb-1">AUP Awareness (0-20)</h4>
              <p className="text-sm">
                Is client data sanitized or generic? Does the prompt avoid including
                real names, emails, IPs, or sensitive information?
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-blue-400 mb-1">Practical Value (0-20)</h4>
              <p className="text-sm">
                If an AI received this prompt, would the response actually be useful
                in the real scenario?
              </p>
            </section>

            <div className="pt-4 border-t border-slate-700">
              <h4 className="font-semibold text-white mb-2">Scoring Guide</h4>
              <ul className="text-sm space-y-1">
                <li><span className="text-green-400">15-20:</span> Excellent</li>
                <li><span className="text-blue-400">10-14:</span> Good</li>
                <li><span className="text-amber-400">5-9:</span> Needs improvement</li>
                <li><span className="text-red-400">0-4:</span> Poor</li>
              </ul>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
