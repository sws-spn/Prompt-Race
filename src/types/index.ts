export type Category = 'troubleshooting' | 'client-communication' | 'documentation' | 'research';
export type Difficulty = 1 | 2 | 3;
export type GameMode = 'versus' | 'practice';
export type GamePhase = 'menu' | 'setup' | 'playing' | 'judging' | 'results' | 'final' | 'practice-playing' | 'practice-scoring' | 'practice-results';

export interface ExamplePrompt {
  prompt: string;
  breakdown: {
    context: string;
    taskClarity: string;
    constraintsFormat: string;
    aupAwareness: string;
    practicalValue: string;
  };
}

export interface Scenario {
  id: string;
  category: Category;
  title: string;
  situation: string;
  roleHint?: string;
  difficulty: Difficulty;
  idealElements: string[];
  examplePrompt: ExamplePrompt;
}

export interface TeamScore {
  context: number;
  taskClarity: number;
  constraintsFormat: number;
  aupAwareness: number;
  practicalValue: number;
  total: number;
  feedback: string;
}

export interface RoundResult {
  roundNumber: number;
  scenario: Scenario;
  team1Prompt: string;
  team2Prompt: string;
  team1Score: TeamScore;
  team2Score: TeamScore;
  roundCommentary: string;
}

export interface GameSettings {
  mode: GameMode;
  team1Name: string;
  team2Name: string;
  totalRounds: number;
  timeLimit: number | null;
  categories: Category[];
  difficultyMix: 'all' | 'easy' | 'hard';
}

export interface PracticeRoundResult {
  roundNumber: number;
  scenario: Scenario;
  prompt: string;
  score: TeamScore;
  timeSpent: number; // seconds
}

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  scenarios: Scenario[];
  currentRound: number;
  currentTeam: 1 | 2;
  team1Prompt: string;
  team2Prompt: string;
  roundResults: RoundResult[];
  team1Position: number;
  team2Position: number;
  // Peer judging state
  judgingTeam: 1 | 2;
  pendingTeam2Score: TeamScore | null; // Score given BY Team 1 FOR Team 2's prompt
  error: string | null;
  // Practice mode state
  practicePrompt: string;
  practiceResults: PracticeRoundResult[];
  practiceStartTime: number | null;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { settings: GameSettings; scenarios: Scenario[] } }
  | { type: 'SUBMIT_PROMPT'; payload: string }
  | { type: 'SUBMIT_PEER_SCORE'; payload: TeamScore }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'GO_TO_SETUP' }
  | { type: 'START_PRACTICE'; payload: { scenarios: Scenario[]; categories: Category[] } }
  | { type: 'SUBMIT_PRACTICE_PROMPT'; payload: string }
  | { type: 'SUBMIT_PRACTICE_SCORE'; payload: TeamScore }
  | { type: 'NEXT_PRACTICE_ROUND' };
