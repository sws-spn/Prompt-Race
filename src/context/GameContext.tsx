import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction } from '../types';

const initialState: GameState = {
  phase: 'menu',
  settings: {
    mode: 'versus',
    team1Name: '',
    team2Name: '',
    totalRounds: 7,
    timeLimit: 180,
    categories: ['troubleshooting', 'client-communication', 'documentation', 'research'],
    difficultyMix: 'all',
  },
  scenarios: [],
  currentRound: 1,
  currentTeam: 1,
  team1Prompt: '',
  team2Prompt: '',
  roundResults: [],
  team1Position: 0,
  team2Position: 0,
  judgingTeam: 1,
  pendingTeam2Score: null,
  error: null,
  // Practice mode state
  practicePrompt: '',
  practiceResults: [],
  practiceStartTime: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_TO_SETUP':
      return { ...state, phase: 'setup' };

    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        settings: action.payload.settings,
        scenarios: action.payload.scenarios,
        currentRound: 1,
        currentTeam: 1,
        team1Prompt: '',
        team2Prompt: '',
        roundResults: [],
        team1Position: 0,
        team2Position: 0,
        judgingTeam: 1,
        pendingTeam2Score: null,
        error: null,
      };

    case 'SUBMIT_PROMPT':
      if (state.currentTeam === 1) {
        return {
          ...state,
          team1Prompt: action.payload,
          currentTeam: 2,
        };
      } else {
        // Both prompts submitted, move to peer judging
        return {
          ...state,
          team2Prompt: action.payload,
          phase: 'judging',
          judgingTeam: 1,
          pendingTeam2Score: null,
        };
      }

    case 'SUBMIT_PEER_SCORE':
      if (state.judgingTeam === 1) {
        // Team 1 just scored Team 2's prompt
        // Store this as pendingTeam2Score and switch to Team 2 judging
        return {
          ...state,
          pendingTeam2Score: action.payload,
          judgingTeam: 2,
        };
      } else {
        // Team 2 just scored Team 1's prompt
        // This is team1Score, and pendingTeam2Score is team2Score
        const team1Score = action.payload;
        const team2Score = state.pendingTeam2Score!;

        const currentScenario = state.scenarios[state.currentRound - 1];
        const newResult = {
          roundNumber: state.currentRound,
          scenario: currentScenario,
          team1Prompt: state.team1Prompt,
          team2Prompt: state.team2Prompt,
          team1Score,
          team2Score,
          roundCommentary: '', // No AI commentary in peer mode
        };

        return {
          ...state,
          phase: 'results',
          roundResults: [...state.roundResults, newResult],
          team1Position: state.team1Position + team1Score.total,
          team2Position: state.team2Position + team2Score.total,
          pendingTeam2Score: null,
        };
      }

    case 'NEXT_ROUND':
      if (state.currentRound >= state.settings.totalRounds) {
        return { ...state, phase: 'final' };
      }
      return {
        ...state,
        phase: 'playing',
        currentRound: state.currentRound + 1,
        currentTeam: 1,
        team1Prompt: '',
        team2Prompt: '',
        judgingTeam: 1,
        pendingTeam2Score: null,
      };

    case 'END_GAME':
      return { ...state, phase: 'final' };

    case 'RESET_GAME':
      return initialState;

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    // Practice Mode Actions
    case 'START_PRACTICE':
      return {
        ...state,
        phase: 'practice-playing',
        settings: {
          ...state.settings,
          mode: 'practice',
          team1Name: 'You',
          team2Name: '',
          totalRounds: action.payload.scenarios.length,
          categories: action.payload.categories,
        },
        scenarios: action.payload.scenarios,
        currentRound: 1,
        practicePrompt: '',
        practiceResults: [],
        practiceStartTime: Date.now(),
        error: null,
      };

    case 'SUBMIT_PRACTICE_PROMPT':
      return {
        ...state,
        phase: 'practice-scoring',
        practicePrompt: action.payload,
      };

    case 'SUBMIT_PRACTICE_SCORE': {
      const timeSpent = state.practiceStartTime
        ? Math.round((Date.now() - state.practiceStartTime) / 1000)
        : 0;

      const practiceResult = {
        roundNumber: state.currentRound,
        scenario: state.scenarios[state.currentRound - 1],
        prompt: state.practicePrompt,
        score: action.payload,
        timeSpent,
      };

      return {
        ...state,
        phase: 'practice-results',
        practiceResults: [...state.practiceResults, practiceResult],
      };
    }

    case 'NEXT_PRACTICE_ROUND':
      if (state.currentRound >= state.settings.totalRounds) {
        return { ...state, phase: 'final' };
      }
      return {
        ...state,
        phase: 'practice-playing',
        currentRound: state.currentRound + 1,
        practicePrompt: '',
        practiceStartTime: Date.now(),
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
