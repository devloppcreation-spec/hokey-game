import { useGameStore } from '../../store/gameStore'
import { useTournamentStore } from '../../store/tournamentStore'
import './TournamentBracket.css'

export function TournamentBracket() {
  const { setCurrentScreen } = useGameStore()
  const { tournament } = useTournamentStore()
  
  if (!tournament) return null
  
  const totalRounds = Math.log2(tournament.playerCount)
  const roundNames = getRoundNames(totalRounds)
  
  const handlePlayMatch = () => {
    setCurrentScreen('game')
  }
  
  // Group matches by round
  const matchesByRound: { [round: number]: typeof tournament.matches } = {}
  for (let i = 1; i <= totalRounds; i++) {
    matchesByRound[i] = tournament.matches.filter(m => m.round === i)
  }
  
  return (
    <div className="tournament-bracket">
      {/* Header */}
      <div className="bracket-header">
        <h1>🏆 {tournament.name}</h1>
        {tournament.status === 'completed' && tournament.champion && (
          <div className="champion-banner">
            <span className="crown">👑</span>
            <span className="champion-name">{tournament.champion.name}</span>
            <span className="champion-label">CHAMPION!</span>
          </div>
        )}
      </div>
      
      {/* Bracket */}
      <div className="bracket-container">
        {Array.from({ length: totalRounds }).map((_, roundIndex) => {
          const round = roundIndex + 1
          const matches = matchesByRound[round] || []
          
          return (
            <div key={round} className="bracket-round">
              <h3 className="round-title">{roundNames[roundIndex]}</h3>
              
              <div className="round-matches">
                {matches.map((match) => (
                  <div 
                    key={match.id} 
                    className={`bracket-match ${match.status}`}
                  >
                    {/* Player 1 */}
                    <div className={`match-player ${match.winner?.id === match.player1?.id ? 'winner' : ''}`}>
                      <span className="player-name">
                        {match.player1 ? (
                          <>
                            {match.player1.isAI ? '🤖' : '👤'} {match.player1.name}
                          </>
                        ) : (
                          <span className="tbd">TBD</span>
                        )}
                      </span>
                      {match.score && <span className="player-score">{match.score.player1}</span>}
                    </div>
                    
                    {/* Divider */}
                    <div className="match-divider">
                      {match.status === 'ready' && match.id === tournament.currentMatch && (
                        <button className="play-btn" onClick={handlePlayMatch}>
                          ▶ PLAY
                        </button>
                      )}
                      {match.status === 'completed' && <span className="vs-text">VS</span>}
                      {match.status === 'pending' && <span className="vs-text">VS</span>}
                    </div>
                    
                    {/* Player 2 */}
                    <div className={`match-player ${match.winner?.id === match.player2?.id ? 'winner' : ''}`}>
                      <span className="player-name">
                        {match.player2 ? (
                          <>
                            {match.player2.isAI ? '🤖' : '👤'} {match.player2.name}
                          </>
                        ) : (
                          <span className="tbd">TBD</span>
                        )}
                      </span>
                      {match.score && <span className="player-score">{match.score.player2}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Back to Menu */}
      {tournament.status === 'completed' && (
        <button 
          className="back-to-menu-btn"
          onClick={() => {
            useTournamentStore.getState().resetTournament()
            setCurrentScreen('menu')
          }}
        >
          🏠 Back to Menu
        </button>
      )}
    </div>
  )
}

function getRoundNames(totalRounds: number): string[] {
  const names: string[] = []
  for (let i = 1; i <= totalRounds; i++) {
    if (i === totalRounds) {
      names.push('Final')
    } else if (i === totalRounds - 1) {
      names.push('Semi-Finals')
    } else if (i === totalRounds - 2) {
      names.push('Quarter-Finals')
    } else {
      names.push(`Round ${i}`)
    }
  }
  return names
}
