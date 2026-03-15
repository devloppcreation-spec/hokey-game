export function VolleyballCourt() {
  return (
    <svg viewBox="0 0 1200 700" className="field-svg volleyball-court" preserveAspectRatio="none">
      {/* Outer area */}
      <rect width="1200" height="700" fill="#8B5A2B"/>
      
      {/* Court surface */}
      <rect x="100" y="75" width="1000" height="550" fill="#f5a623"/>
      
      {/* Court boundary */}
      <rect x="100" y="75" width="1000" height="550" fill="none" stroke="white" strokeWidth="5"/>
      
      {/* Center line */}
      <line x1="600" y1="75" x2="600" y2="625" stroke="white" strokeWidth="4"/>
      
      {/* Attack lines (3m lines) */}
      <line x1="400" y1="75" x2="400" y2="625" stroke="white" strokeWidth="3"/>
      <line x1="800" y1="75" x2="800" y2="625" stroke="white" strokeWidth="3"/>
      
      {/* Net */}
      <rect x="595" y="55" width="10" height="590" fill="rgba(0,0,0,0.25)"/>
      <line x1="600" y1="55" x2="600" y2="645" stroke="#222" strokeWidth="4"/>
      
      {/* Net antenna markers */}
      <rect x="598" y="75" width="4" height="30" fill="#ff0000"/>
      <rect x="598" y="595" width="4" height="30" fill="#ff0000"/>
      
      {/* Net posts */}
      <circle cx="600" cy="45" r="10" fill="#444"/>
      <circle cx="600" cy="655" r="10" fill="#444"/>

      {/* Goal Target Zones (Web of goals) */}
      {/* Left Goal Target */}
      <g className="goal-target left">
        <rect x="20" y="280" width="40" height="140" fill="rgba(255, 255, 255, 0.2)" stroke="white" strokeWidth="4" rx="4"/>
        <line x1="30" y1="280" x2="30" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5 5"/>
        <line x1="40" y1="280" x2="40" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5 5"/>
        <line x1="50" y1="280" x2="50" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5 5"/>
        <rect x="60" y="260" width="8" height="180" fill="rgba(255, 100, 100, 0.7)" stroke="white" strokeWidth="2" rx="2" /> {/* Red target line */}
      </g>

      {/* Right Goal Target */}
      <g className="goal-target right">
        <rect x="1140" y="280" width="40" height="140" fill="rgba(255, 255, 255, 0.2)" stroke="white" strokeWidth="4" rx="4"/>
        <line x1="1150" y1="280" x2="1150" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5 5"/>
        <line x1="1160" y1="280" x2="1160" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5 5"/>
        <line x1="1170" y1="280" x2="1170" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5 5"/>
        <rect x="1132" y="260" width="8" height="180" fill="rgba(255, 100, 100, 0.7)" stroke="white" strokeWidth="2" rx="2" /> {/* Red target line */}
      </g>
    </svg>
  )
}
