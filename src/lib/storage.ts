// localStorage utilities for Prompt Race

import type { Scenario, Category } from '../types';

// Storage keys
const KEYS = {
  GAME_HISTORY: 'promptrace_history',
  ACHIEVEMENTS: 'promptrace_achievements',
  CUSTOM_SCENARIOS: 'promptrace_custom_scenarios',
  SETTINGS: 'promptrace_settings',
  STATS: 'promptrace_stats',
} as const;

// Types
export interface GameHistoryEntry {
  id: string;
  date: string;
  mode: 'versus' | 'practice';
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  rounds: number;
  winner: 'team1' | 'team2' | 'tie';
  categoryScores: {
    team1: CategoryScores;
    team2: CategoryScores;
  };
}

export interface CategoryScores {
  context: number;
  taskClarity: number;
  constraintsFormat: number;
  aupAwareness: number;
  practicalValue: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress?: number;
  target?: number;
}

export interface SavedSettings {
  team1Name: string;
  team2Name: string;
  totalRounds: number;
  timeLimit: number | null;
  categories: Category[];
  difficultyMix: 'all' | 'easy' | 'hard';
}

export interface PlayerStats {
  totalGames: number;
  totalWins: number;
  totalPrompts: number;
  averageScore: number;
  bestScore: number;
  categoryAverages: CategoryScores;
  currentStreak: number;
  bestStreak: number;
  fastestPrompt: number | null; // seconds
}

// Default achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    name: 'First Steps',
    description: 'Complete your first game',
    icon: '🎮',
    unlockedAt: null,
  },
  {
    id: 'prompt_master',
    name: 'Prompt Master',
    description: 'Score 90+ on a single prompt',
    icon: '🏆',
    unlockedAt: null,
  },
  {
    id: 'perfect_context',
    name: 'Context King',
    description: 'Score 20/20 on Context',
    icon: '📋',
    unlockedAt: null,
  },
  {
    id: 'perfect_clarity',
    name: 'Crystal Clear',
    description: 'Score 20/20 on Task Clarity',
    icon: '💎',
    unlockedAt: null,
  },
  {
    id: 'perfect_format',
    name: 'Format Pro',
    description: 'Score 20/20 on Constraints & Format',
    icon: '📐',
    unlockedAt: null,
  },
  {
    id: 'aup_champion',
    name: 'AUP Champion',
    description: 'Score 18+ on AUP Awareness 3 times',
    icon: '🛡️',
    unlockedAt: null,
    progress: 0,
    target: 3,
  },
  {
    id: 'practical_wizard',
    name: 'Practical Wizard',
    description: 'Score 20/20 on Practical Value',
    icon: '🧙',
    unlockedAt: null,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Submit a prompt in under 60 seconds',
    icon: '⚡',
    unlockedAt: null,
  },
  {
    id: 'winning_streak_3',
    name: 'Hot Streak',
    description: 'Win 3 rounds in a row',
    icon: '🔥',
    unlockedAt: null,
  },
  {
    id: 'winning_streak_5',
    name: 'On Fire',
    description: 'Win 5 rounds in a row',
    icon: '🌟',
    unlockedAt: null,
  },
  {
    id: 'games_10',
    name: 'Regular Player',
    description: 'Complete 10 games',
    icon: '🎯',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
  {
    id: 'games_25',
    name: 'Dedicated Learner',
    description: 'Complete 25 games',
    icon: '📚',
    unlockedAt: null,
    progress: 0,
    target: 25,
  },
  {
    id: 'all_categories',
    name: 'Well Rounded',
    description: 'Play scenarios from all 4 categories',
    icon: '🎪',
    unlockedAt: null,
    progress: 0,
    target: 4,
  },
  {
    id: 'improvement',
    name: 'Getting Better',
    description: 'Improve your average score by 10 points',
    icon: '📈',
    unlockedAt: null,
  },
];

// Helper functions
function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Game History
export function getGameHistory(): GameHistoryEntry[] {
  return safeGetItem<GameHistoryEntry[]>(KEYS.GAME_HISTORY, []);
}

export function addGameToHistory(game: Omit<GameHistoryEntry, 'id' | 'date'>): GameHistoryEntry {
  const history = getGameHistory();
  const newGame: GameHistoryEntry = {
    ...game,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  history.unshift(newGame); // Add to beginning
  // Keep last 50 games
  const trimmed = history.slice(0, 50);
  safeSetItem(KEYS.GAME_HISTORY, trimmed);
  return newGame;
}

export function clearGameHistory(): void {
  safeSetItem(KEYS.GAME_HISTORY, []);
}

// Achievements
export function getAchievements(): Achievement[] {
  const saved = safeGetItem<Achievement[]>(KEYS.ACHIEVEMENTS, []);
  // Merge with defaults to add any new achievements
  return DEFAULT_ACHIEVEMENTS.map(defaultAch => {
    const savedAch = saved.find(s => s.id === defaultAch.id);
    return savedAch || defaultAch;
  });
}

export function updateAchievement(id: string, updates: Partial<Achievement>): Achievement | null {
  const achievements = getAchievements();
  const index = achievements.findIndex(a => a.id === id);
  if (index === -1) return null;

  achievements[index] = { ...achievements[index], ...updates };
  safeSetItem(KEYS.ACHIEVEMENTS, achievements);
  return achievements[index];
}

export function unlockAchievement(id: string): Achievement | null {
  return updateAchievement(id, { unlockedAt: new Date().toISOString() });
}

export function incrementAchievementProgress(id: string): Achievement | null {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === id);
  if (!achievement || achievement.unlockedAt) return achievement || null;

  const newProgress = (achievement.progress || 0) + 1;
  if (achievement.target && newProgress >= achievement.target) {
    return unlockAchievement(id);
  }
  return updateAchievement(id, { progress: newProgress });
}

// Custom Scenarios
export function getCustomScenarios(): Scenario[] {
  return safeGetItem<Scenario[]>(KEYS.CUSTOM_SCENARIOS, []);
}

export function addCustomScenario(scenario: Omit<Scenario, 'id'>): Scenario {
  const scenarios = getCustomScenarios();
  const newScenario: Scenario = {
    ...scenario,
    id: `custom_${crypto.randomUUID()}`,
  };
  scenarios.push(newScenario);
  safeSetItem(KEYS.CUSTOM_SCENARIOS, scenarios);
  return newScenario;
}

export function updateCustomScenario(id: string, updates: Partial<Scenario>): Scenario | null {
  const scenarios = getCustomScenarios();
  const index = scenarios.findIndex(s => s.id === id);
  if (index === -1) return null;

  scenarios[index] = { ...scenarios[index], ...updates };
  safeSetItem(KEYS.CUSTOM_SCENARIOS, scenarios);
  return scenarios[index];
}

export function deleteCustomScenario(id: string): boolean {
  const scenarios = getCustomScenarios();
  const filtered = scenarios.filter(s => s.id !== id);
  if (filtered.length === scenarios.length) return false;

  safeSetItem(KEYS.CUSTOM_SCENARIOS, filtered);
  return true;
}

// Settings
export function getSavedSettings(): SavedSettings | null {
  return safeGetItem<SavedSettings | null>(KEYS.SETTINGS, null);
}

export function saveSettings(settings: SavedSettings): void {
  safeSetItem(KEYS.SETTINGS, settings);
}

// Player Stats
export function getPlayerStats(): PlayerStats {
  return safeGetItem<PlayerStats>(KEYS.STATS, {
    totalGames: 0,
    totalWins: 0,
    totalPrompts: 0,
    averageScore: 0,
    bestScore: 0,
    categoryAverages: {
      context: 0,
      taskClarity: 0,
      constraintsFormat: 0,
      aupAwareness: 0,
      practicalValue: 0,
    },
    currentStreak: 0,
    bestStreak: 0,
    fastestPrompt: null,
  });
}

export function updatePlayerStats(updates: Partial<PlayerStats>): PlayerStats {
  const stats = getPlayerStats();
  const newStats = { ...stats, ...updates };
  safeSetItem(KEYS.STATS, newStats);
  return newStats;
}

// Utility: Check and award achievements based on game results
export function checkAchievements(
  _gameResult: GameHistoryEntry,
  promptTime?: number
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const stats = getPlayerStats();

  // First game
  if (stats.totalGames === 1) {
    const ach = unlockAchievement('first_game');
    if (ach?.unlockedAt) newlyUnlocked.push(ach);
  }

  // Games count achievements
  if (stats.totalGames >= 10) {
    const ach = getAchievements().find(a => a.id === 'games_10');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('games_10');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  if (stats.totalGames >= 25) {
    const ach = getAchievements().find(a => a.id === 'games_25');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('games_25');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }

  // Speed demon
  if (promptTime && promptTime < 60) {
    const ach = getAchievements().find(a => a.id === 'speed_demon');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('speed_demon');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }

  // Streak achievements
  if (stats.currentStreak >= 3) {
    const ach = getAchievements().find(a => a.id === 'winning_streak_3');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('winning_streak_3');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  if (stats.currentStreak >= 5) {
    const ach = getAchievements().find(a => a.id === 'winning_streak_5');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('winning_streak_5');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }

  return newlyUnlocked;
}

// Check score-based achievements
export function checkScoreAchievements(
  score: number,
  categoryScores: CategoryScores
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  // Prompt Master (90+ total)
  if (score >= 90) {
    const ach = getAchievements().find(a => a.id === 'prompt_master');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('prompt_master');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }

  // Perfect category scores
  if (categoryScores.context === 20) {
    const ach = getAchievements().find(a => a.id === 'perfect_context');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('perfect_context');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  if (categoryScores.taskClarity === 20) {
    const ach = getAchievements().find(a => a.id === 'perfect_clarity');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('perfect_clarity');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  if (categoryScores.constraintsFormat === 20) {
    const ach = getAchievements().find(a => a.id === 'perfect_format');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('perfect_format');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  if (categoryScores.practicalValue === 20) {
    const ach = getAchievements().find(a => a.id === 'practical_wizard');
    if (ach && !ach.unlockedAt) {
      const unlocked = unlockAchievement('practical_wizard');
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }

  // AUP Champion (18+ three times)
  if (categoryScores.aupAwareness >= 18) {
    const result = incrementAchievementProgress('aup_champion');
    if (result?.unlockedAt) newlyUnlocked.push(result);
  }

  return newlyUnlocked;
}
