export function SoccerField() {
  return (
    <svg viewBox="0 0 1200 700" className="field-svg soccer-field" preserveAspectRatio="none">
      <defs>
        {/* Grass stripes */}
        <pattern id="grass" width="50" height="700" patternUnits="userSpaceOnUse">
          <rect width="25" height="700" fill="#2d8a2d"/>
          <rect x="25" width="25" height="700" fill="#339933"/>
        </pattern>
      </defs>
      
      {/* Grass background */}
      <rect width="1200" height="700" fill="url(#grass)"/>
      
      {/* Field boundary */}
      <rect x="50" y="50" width="1100" height="600" fill="none" stroke="white" strokeWidth="4"/>
      
      {/* Center line */}
      <line x1="600" y1="50" x2="600" y2="650" stroke="white" strokeWidth="3"/>
      
      {/* Center circle */}
      <circle cx="600" cy="350" r="75" fill="none" stroke="white" strokeWidth="3"/>
      <circle cx="600" cy="350" r="5" fill="white"/>
      
      {/* Left penalty area */}
      <rect x="50" y="165" width="160" height="370" fill="none" stroke="white" strokeWidth="3"/>
      
      {/* Left goal area */}
      <rect x="50" y="250" width="55" height="200" fill="none" stroke="white" strokeWidth="3"/>
      
      {/* Left penalty arc */}
      <path d="M 210 260 A 75 75 0 0 1 210 440" fill="none" stroke="white" strokeWidth="3"/>
      
      {/* Left penalty spot */}
      <circle cx="155" cy="350" r="4" fill="white"/>
      
      {/* Right penalty area */}
      <rect x="990" y="165" width="160" height="370" fill="none" stroke="white" strokeWidth="3"/>
      
      {/* Right goal area */}
      <rect x="1095" y="250" width="55" height="200" fill="none" stroke="white" strokeWidth="3"/>
      
      {/* Right penalty arc */}
      <path d="M 990 260 A 75 75 0 0 0 990 440" fill="none" stroke="white" strokeWidth="3"/>
      
      {/* Right penalty spot */}
      <circle cx="1045" cy="350" r="4" fill="white"/>
      
      {/* Corner arcs */}
      <path d="M 50 60 A 10 10 0 0 0 60 50" fill="none" stroke="white" strokeWidth="2"/>
      <path d="M 1140 50 A 10 10 0 0 0 1150 60" fill="none" stroke="white" strokeWidth="2"/>
      <path d="M 50 640 A 10 10 0 0 1 60 650" fill="none" stroke="white" strokeWidth="2"/>
      <path d="M 1140 650 A 10 10 0 0 1 1150 640" fill="none" stroke="white" strokeWidth="2"/>
      
      {/* Left goal */}
      <rect x="15" y="280" width="35" height="140" fill="none" stroke="white" strokeWidth="5"/>
      
      {/* Right goal */}
      <rect x="1150" y="280" width="35" height="140" fill="none" stroke="white" strokeWidth="5"/>
    </svg>
  )
}
