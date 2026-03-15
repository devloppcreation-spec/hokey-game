export function HockeyRink() {
  return (
    <svg viewBox="0 0 1200 700" className="field-svg hockey-rink" preserveAspectRatio="none">
      <defs>
        {/* Ice gradient */}
        <linearGradient id="ice" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f4fc"/>
          <stop offset="50%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#e0f0ff"/>
        </linearGradient>
        
        {/* Goal net pattern */}
        <pattern id="hockeyNet" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
        </pattern>
      </defs>
      
      {/* Ice surface fills entire viewBox */}
      <rect x="0" y="0" width="1200" height="700" rx="16" ry="16" fill="url(#ice)"/>
      
      {/* Center red line */}
      <line x1="600" y1="0" x2="600" y2="700" stroke="#cc0000" strokeWidth="10"/>
      
      {/* Blue lines */}
      <line x1="360" y1="0" x2="360" y2="700" stroke="#0055aa" strokeWidth="8"/>
      <line x1="840" y1="0" x2="840" y2="700" stroke="#0055aa" strokeWidth="8"/>
      
      {/* Center circle */}
      <circle cx="600" cy="350" r="65" fill="none" stroke="#0055aa" strokeWidth="4"/>
      <circle cx="600" cy="350" r="8" fill="#0055aa"/>
      
      {/* Goal lines */}
      <line x1="96" y1="60" x2="96" y2="640" stroke="#cc0000" strokeWidth="3"/>
      <line x1="1104" y1="60" x2="1104" y2="640" stroke="#cc0000" strokeWidth="3"/>
      
      {/* Face-off circles */}
      <circle cx="240" cy="190" r="50" fill="none" stroke="#cc0000" strokeWidth="3"/>
      <circle cx="240" cy="510" r="50" fill="none" stroke="#cc0000" strokeWidth="3"/>
      <circle cx="960" cy="190" r="50" fill="none" stroke="#cc0000" strokeWidth="3"/>
      <circle cx="960" cy="510" r="50" fill="none" stroke="#cc0000" strokeWidth="3"/>
      
      {/* Face-off dots */}
      <circle cx="240" cy="190" r="7" fill="#cc0000"/>
      <circle cx="240" cy="510" r="7" fill="#cc0000"/>
      <circle cx="960" cy="190" r="7" fill="#cc0000"/>
      <circle cx="960" cy="510" r="7" fill="#cc0000"/>
      
      {/* Neutral zone dots */}
      <circle cx="480" cy="190" r="5" fill="#cc0000"/>
      <circle cx="480" cy="510" r="5" fill="#cc0000"/>
      <circle cx="720" cy="190" r="5" fill="#cc0000"/>
      <circle cx="720" cy="510" r="5" fill="#cc0000"/>
      
      {/* Goal creases */}
      <path d="M 96 295 Q 46 350 96 405" fill="rgba(135,206,250,0.4)" stroke="#0055aa" strokeWidth="2"/>
      <path d="M 1104 295 Q 1154 350 1104 405" fill="rgba(135,206,250,0.4)" stroke="#0055aa" strokeWidth="2"/>
      
      {/* Left goal */}
      <rect x="0" y="280" width="48" height="140" fill="url(#hockeyNet)" stroke="#cc0000" strokeWidth="5" rx="3"/>
      
      {/* Right goal */}
      <rect x="1152" y="280" width="48" height="140" fill="url(#hockeyNet)" stroke="#cc0000" strokeWidth="5" rx="3"/>
    </svg>
  )
}
