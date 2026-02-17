import { useState } from 'react';
import { Button, Card, Modal } from '../components/ui';
import { useGame } from '../context/GameContext';

export function MainMenu() {
  const { dispatch } = useGame();
  const [showRules, setShowRules] = useState(false);

  const handleStartGame = () => {
    dispatch({ type: 'GO_TO_SETUP' });
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
        <div className="flex flex-col gap-4 mb-8">
          <Button size="lg" onClick={handleStartGame} className="w-full">
            New Game
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setShowRules(true)} className="w-full">
            Scoring Rubric
          </Button>
        </div>

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
