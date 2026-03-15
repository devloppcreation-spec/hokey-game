interface StadiumBackgroundProps {
  sport?: string
  intensity?: string // Kept for compatibility with GameContainer
}

export function StadiumBackground({ sport: _sport = 'hockey' }: StadiumBackgroundProps) {
  return (
    <div className="stadium-bg">
      {/* Main gradient background */}
      <div className="stadium-gradient" />
      
      {/* Static stadium lights (no animation) */}
      <div className="stadium-lights">
        <div className="light light-left" />
        <div className="light light-right" />
      </div>
      
      {/* Vignette overlay for depth */}
      <div className="stadium-vignette" />
      
      {/* Subtle ambient glow at top */}
      <div className="ambient-glow" />
    </div>
  )
}
