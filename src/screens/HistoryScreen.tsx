import { useState, useMemo } from 'react';
import { Button, Card, Modal } from '../components/ui';
import { useGame } from '../context/GameContext';
import {
  getGameHistory,
  getPlayerStats,
  clearGameHistory,
  getAchievements,
  type GameHistoryEntry,
  type CategoryScores,
} from '../lib/storage';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getCategoryLabel(key: keyof CategoryScores): string {
  const labels: Record<keyof CategoryScores, string> = {
    context: 'Context',
    taskClarity: 'Task Clarity',
    constraintsFormat: 'Constraints & Format',
    aupAwareness: 'AUP Awareness',
    practicalValue: 'Practical Value',
  };
  return labels[key];
}

function StatCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </div>
  );
}

function GameCard({ game }: { game: GameHistoryEntry }) {
  const [expanded, setExpanded] = useState(false);

  const winnerName = game.winner === 'team1'
    ? game.team1Name
    : game.winner === 'team2'
    ? game.team2Name
    : 'Tie';

  return (
    <Card className="p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="text-sm text-slate-400">{formatDate(game.date)}</div>
          <div className="font-semibold text-white">
            {game.team1Name} vs {game.team2Name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {game.team1Score} - {game.team2Score}
          </div>
          <div className={`text-sm ${game.winner === 'tie' ? 'text-yellow-400' : 'text-green-400'}`}>
            {game.winner === 'tie' ? 'Tie' : `${winnerName} wins`}
          </div>
        </div>
        <button className="ml-4 text-slate-400 hover:text-white">
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">{game.team1Name}</h4>
              <div className="space-y-1">
                {(Object.keys(game.categoryScores.team1) as (keyof CategoryScores)[]).map((key) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-400">{getCategoryLabel(key)}</span>
                    <span className="text-white">{game.categoryScores.team1[key]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">{game.team2Name}</h4>
              <div className="space-y-1">
                {(Object.keys(game.categoryScores.team2) as (keyof CategoryScores)[]).map((key) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-400">{getCategoryLabel(key)}</span>
                    <span className="text-white">{game.categoryScores.team2[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 text-center">
            {game.rounds} rounds • {game.mode} mode
          </div>
        </div>
      )}
    </Card>
  );
}

export function HistoryScreen() {
  const { dispatch } = useGame();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);
  const [history, setHistory] = useState<GameHistoryEntry[]>(getGameHistory);
  const stats = useMemo(() => getPlayerStats(), []);
  const achievements = useMemo(() => getAchievements(), []);

  const handleClearHistory = () => {
    clearGameHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const generateTrainingReport = () => {
    const unlockedAchievements = achievements.filter(a => a.unlockedAt);
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let report = `# Prompt Race Training Report\n`;
    report += `Generated: ${now}\n\n`;
    report += `---\n\n`;

    report += `## Overview\n\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Games Played | ${stats.totalGames} |\n`;
    report += `| Total Prompts Written | ${stats.totalPrompts} |\n`;
    report += `| Win Rate | ${stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0}% |\n`;
    report += `| Average Score | ${stats.averageScore}/100 |\n`;
    report += `| Best Score | ${stats.bestScore}/100 |\n`;
    report += `| Best Winning Streak | ${stats.bestStreak} games |\n\n`;

    report += `## Category Performance\n\n`;
    report += `| Category | Average Score | Rating |\n`;
    report += `|----------|---------------|--------|\n`;

    const categories: { key: keyof CategoryScores; label: string }[] = [
      { key: 'context', label: 'Context' },
      { key: 'taskClarity', label: 'Task Clarity' },
      { key: 'constraintsFormat', label: 'Constraints & Format' },
      { key: 'aupAwareness', label: 'AUP Awareness' },
      { key: 'practicalValue', label: 'Practical Value' },
    ];

    categories.forEach(({ key, label }) => {
      const score = stats.categoryAverages[key];
      let rating = 'Needs Improvement';
      if (score >= 16) rating = 'Excellent';
      else if (score >= 12) rating = 'Good';
      else if (score >= 8) rating = 'Fair';
      report += `| ${label} | ${score}/20 | ${rating} |\n`;
    });

    // Find weakest and strongest
    let weakest = categories[0];
    let strongest = categories[0];
    categories.forEach(cat => {
      if (stats.categoryAverages[cat.key] < stats.categoryAverages[weakest.key]) weakest = cat;
      if (stats.categoryAverages[cat.key] > stats.categoryAverages[strongest.key]) strongest = cat;
    });

    report += `\n### Key Insights\n\n`;
    report += `- **Strongest Area:** ${strongest.label} (${stats.categoryAverages[strongest.key]}/20)\n`;
    report += `- **Focus Area:** ${weakest.label} (${stats.categoryAverages[weakest.key]}/20)\n\n`;

    // Improvement tips based on weakest area
    const tips: Record<keyof CategoryScores, string> = {
      context: 'Include more environmental details like OS version, error messages, user role, and timeline.',
      taskClarity: 'Be more specific about deliverables - state exactly what format, length, and content you need.',
      constraintsFormat: 'Add explicit formatting instructions, tone requirements, and audience specifications.',
      aupAwareness: 'Always sanitize sensitive data using placeholders like [CLIENT], [USER@EMAIL], or [IP_ADDRESS].',
      practicalValue: 'Focus on actionable outcomes - ensure the AI response would directly solve the problem.',
    };

    report += `### Improvement Recommendation\n\n`;
    report += `${tips[weakest.key]}\n\n`;

    if (unlockedAchievements.length > 0) {
      report += `## Achievements Unlocked (${unlockedAchievements.length}/${achievements.length})\n\n`;
      unlockedAchievements.forEach(ach => {
        const date = ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : '';
        report += `- ${ach.icon} **${ach.name}** - ${ach.description} (${date})\n`;
      });
      report += `\n`;
    }

    if (history.length > 0) {
      report += `## Recent Games\n\n`;
      report += `| Date | Teams | Score | Winner |\n`;
      report += `|------|-------|-------|--------|\n`;
      history.slice(0, 10).forEach(game => {
        const date = new Date(game.date).toLocaleDateString();
        const winner = game.winner === 'tie' ? 'Tie' : game.winner === 'team1' ? game.team1Name : game.team2Name;
        report += `| ${date} | ${game.team1Name} vs ${game.team2Name} | ${game.team1Score}-${game.team2Score} | ${winner} |\n`;
      });
      report += `\n`;
    }

    report += `---\n\n`;
    report += `*Report generated by Prompt Race - https://prompt-race.vercel.app*\n`;

    return report;
  };

  const handleCopyReport = async () => {
    const report = generateTrainingReport();
    await navigator.clipboard.writeText(report);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const report = generateTrainingReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-race-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate category averages for display
  const categoryKeys: (keyof CategoryScores)[] = [
    'context', 'taskClarity', 'constraintsFormat', 'aupAwareness', 'practicalValue'
  ];

  const weakestCategory = useMemo(() => {
    if (stats.totalGames === 0) return null;
    let lowest = categoryKeys[0];
    for (const key of categoryKeys) {
      if (stats.categoryAverages[key] < stats.categoryAverages[lowest]) {
        lowest = key;
      }
    }
    return lowest;
  }, [stats]);

  const strongestCategory = useMemo(() => {
    if (stats.totalGames === 0) return null;
    let highest = categoryKeys[0];
    for (const key of categoryKeys) {
      if (stats.categoryAverages[key] > stats.categoryAverages[highest]) {
        highest = key;
      }
    }
    return highest;
  }, [stats]);

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Game History</h1>
            <p className="text-slate-400">Track your progress over time</p>
          </div>
          <Button variant="ghost" onClick={() => dispatch({ type: 'RESET_GAME' })}>
            Back to Menu
          </Button>
        </div>

        {/* Overall Stats */}
        {stats.totalGames > 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowExportModal(true)}>
                📄 Export Training Report
              </Button>
            </div>

            <Card className="mb-8 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Overall Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Games Played" value={stats.totalGames} />
                <StatCard
                  label="Win Rate"
                  value={`${Math.round((stats.totalWins / stats.totalGames) * 100)}%`}
                  subtext={`${stats.totalWins} wins`}
                />
                <StatCard
                  label="Avg Score"
                  value={Math.round(stats.averageScore)}
                  subtext="per prompt"
                />
                <StatCard
                  label="Best Score"
                  value={stats.bestScore}
                  subtext="personal best"
                />
              </div>

              {/* Streak Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <div className="text-lg font-bold text-white">{stats.currentStreak}</div>
                      <div className="text-sm text-slate-400">Current Streak</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌟</span>
                    <div>
                      <div className="text-lg font-bold text-white">{stats.bestStreak}</div>
                      <div className="text-sm text-slate-400">Best Streak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <h4 className="text-sm font-medium text-slate-400 mb-3">Category Averages</h4>
              <div className="space-y-3">
                {categoryKeys.map((key) => {
                  const value = stats.categoryAverages[key];
                  const percentage = (value / 20) * 100;
                  const isWeakest = key === weakestCategory;
                  const isStrongest = key === strongestCategory;

                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`${isWeakest ? 'text-red-400' : isStrongest ? 'text-green-400' : 'text-slate-300'}`}>
                          {getCategoryLabel(key)}
                          {isWeakest && ' (Focus Area)'}
                          {isStrongest && ' (Strength)'}
                        </span>
                        <span className="text-white">{value.toFixed(1)}/20</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isWeakest ? 'bg-red-500' : isStrongest ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Game History List */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Games</h3>
              {history.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Clear History
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-400">No games recorded yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {history.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Games Yet</h3>
            <p className="text-slate-400 mb-6">
              Complete your first game to start tracking your progress
            </p>
            <Button onClick={() => dispatch({ type: 'GO_TO_SETUP' })}>
              Start a Game
            </Button>
          </Card>
        )}

        {/* Clear Confirmation Modal */}
        <Modal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          title="Clear History"
        >
          <p className="text-slate-300 mb-6">
            Are you sure you want to clear all game history? This will reset your statistics and cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleClearHistory}
            >
              Clear All
            </Button>
          </div>
        </Modal>

        {/* Export Report Modal */}
        <Modal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Export Training Report"
        >
          <p className="text-slate-300 mb-6">
            Generate a comprehensive training report with your statistics, category performance, achievements, and game history.
          </p>
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-white mb-2">Report includes:</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Overall statistics (games, win rate, scores)</li>
              <li>• Category performance breakdown</li>
              <li>• Personalized improvement recommendations</li>
              <li>• Achievement progress</li>
              <li>• Recent game history</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleCopyReport}
            >
              {exportCopied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </Button>
            <Button
              className="flex-1"
              onClick={handleDownloadReport}
            >
              📥 Download .md
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
