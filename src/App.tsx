import { GameProvider, useGame } from './context/GameContext';
import { GameLayout } from './components/layout/GameLayout';
import {
  MainMenu,
  GameSetup,
  RoundScreen,
  PeerJudgingScreen,
  ResultsScreen,
  FinalResults,
  CustomScenariosScreen,
  HistoryScreen,
  AchievementsScreen,
} from './screens';
import { PracticePlayingScreen } from './screens/PracticePlayingScreen';
import { PracticeScoringScreen } from './screens/PracticeScoringScreen';
import { PracticeResultsScreen } from './screens/PracticeResultsScreen';

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'menu':
      return <MainMenu />;
    case 'setup':
      return <GameSetup />;
    case 'playing':
      return <RoundScreen />;
    case 'judging':
      return <PeerJudgingScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'final':
      return <FinalResults />;
    case 'custom-scenarios':
      return <CustomScenariosScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'achievements':
      return <AchievementsScreen />;
    // Practice Mode phases
    case 'practice-playing':
      return <PracticePlayingScreen />;
    case 'practice-scoring':
      return <PracticeScoringScreen />;
    case 'practice-results':
      return <PracticeResultsScreen />;
    default:
      return <MainMenu />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameLayout>
        <GameRouter />
      </GameLayout>
    </GameProvider>
  );
}

export default App;
