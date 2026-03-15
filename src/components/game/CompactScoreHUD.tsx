import './CompactScoreHUD.css'

interface CompactScoreHUDProps {
  player1Score: number
  player2Score: number
  player1Name: string
  player2Name: string
}

export function CompactScoreHUD({ 
  player1Score, 
  player2Score,
  player1Name,
  player2Name 
}: CompactScoreHUDProps) {
  return (
    <div className="compact-hud">
      <div className="hud-player hud-player-left">
        <span className="hud-name">{player1Name}</span>
        <span className="hud-score">{player1Score}</span>
      </div>
      <div className="hud-divider">—</div>
      <div className="hud-player hud-player-right">
        <span className="hud-score">{player2Score}</span>
        <span className="hud-name">{player2Name}</span>
      </div>
    </div>
  )
}
