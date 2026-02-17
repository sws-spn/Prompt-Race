import { useState, useMemo } from 'react';
import { Button, Card } from '../components/ui';
import { useGame } from '../context/GameContext';
import { getAchievements, type Achievement } from '../lib/storage';

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const isUnlocked = !!achievement.unlockedAt;
  const hasProgress = achievement.target && achievement.progress !== undefined;
  const progressPercent = hasProgress ? Math.min(100, (achievement.progress! / achievement.target!) * 100) : 0;

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isUnlocked
          ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30'
          : 'bg-slate-800/50 border-slate-700'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}
        >
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}
            >
              {achievement.name}
            </h3>
            {isUnlocked && (
              <span className="text-amber-400 text-sm">✓ Unlocked</span>
            )}
          </div>
          <p className={`text-sm ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
            {achievement.description}
          </p>

          {/* Progress bar for progressive achievements */}
          {hasProgress && !isUnlocked && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.target}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlock date */}
          {isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-slate-500 mt-2">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AchievementsScreen() {
  const { dispatch } = useGame();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const achievements = useMemo(() => getAchievements(), []);

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const filteredAchievements = useMemo(() => {
    if (filter === 'unlocked') return achievements.filter(a => a.unlockedAt);
    if (filter === 'locked') return achievements.filter(a => !a.unlockedAt);
    return achievements;
  }, [achievements, filter]);

  // Group achievements by category
  const categories = [
    {
      title: 'Getting Started',
      ids: ['first_game', 'games_10', 'games_25'],
    },
    {
      title: 'Mastery',
      ids: ['prompt_master', 'perfect_context', 'perfect_clarity', 'perfect_format', 'aup_champion', 'practical_wizard'],
    },
    {
      title: 'Speed & Streaks',
      ids: ['speed_demon', 'winning_streak_3', 'winning_streak_5'],
    },
    {
      title: 'Variety',
      ids: ['all_categories', 'improvement'],
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
            <p className="text-slate-400">
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
          <Button variant="ghost" onClick={() => dispatch({ type: 'RESET_GAME' })}>
            Back to Menu
          </Button>
        </div>

        {/* Progress Card */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                {unlockedCount === achievements.length
                  ? 'All Achievements Unlocked!'
                  : unlockedCount === 0
                  ? 'Start Your Journey'
                  : 'Keep Going!'}
              </h3>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all"
                  style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {achievements.length - unlockedCount} achievements remaining
              </p>
            </div>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'All' },
            { value: 'unlocked', label: 'Unlocked' },
            { value: 'locked', label: 'Locked' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {categories.map(category => {
            const categoryAchievements = filteredAchievements.filter(a =>
              category.ids.includes(a.id)
            );
            if (categoryAchievements.length === 0) return null;

            return (
              <div key={category.title}>
                <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {categoryAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">
              {filter === 'unlocked' ? '🔒' : '🏆'}
            </div>
            <p className="text-slate-400">
              {filter === 'unlocked'
                ? "You haven't unlocked any achievements yet. Play some games to earn them!"
                : 'All achievements are unlocked!'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
