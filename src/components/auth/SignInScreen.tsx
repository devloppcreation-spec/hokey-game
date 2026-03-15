import { useGameStore } from '../../store/gameStore'
import { DualPlayerSignIn } from './DualPlayerSignIn'
import { SinglePlayerSignIn } from './SinglePlayerSignIn'
import type { PlayerInfo } from '@/types/user.types'

interface SignInScreenProps {
  onBothPlayersReady?: (player1: PlayerInfo, player2: PlayerInfo) => void;
}

export function SignInScreen({ onBothPlayersReady }: SignInScreenProps) {
  const { gameMode } = useGameStore()
  
  // Route based on game mode
  switch (gameMode) {
    case '1v1':
      // 1 VS 1 = Two humans = Dual sign-in (Player 1 + Player 2)
      return <DualPlayerSignIn onBothPlayersReady={onBothPlayersReady!} />
    
    case 'vs-ai':
      // VS COMPUTER = One human vs AI = Single sign-in (Player 1 only)
      return <SinglePlayerSignIn />
    
    default:
      // Fallback to single player
      return <SinglePlayerSignIn />
  }
}
