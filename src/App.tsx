import { GameProvider, useGame } from './context/GameContext';
import { GameLayout } from './components/layout/GameLayout';
import {
  MainMenu,
  GameSetup,
  RoundScreen,
  PeerJudgingScreen,
  ResultsScreen,
  FinalResults,
} from './screens';

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
