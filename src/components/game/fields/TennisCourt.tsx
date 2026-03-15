export function TennisCourt() {
  return (
    <svg viewBox="0 0 1200 700" className="field-svg tennis-court" preserveAspectRatio="none">
      {/* Outer area (green) */}
      <rect width="1200" height="700" fill="#1a7535"/>
      
      {/* Playing surface (blue) */}
      <rect x="75" y="55" width="1050" height="590" fill="#2563eb"/>
      
      {/* Court boundary */}
      <rect x="75" y="55" width="1050" height="590" fill="none" stroke="white" strokeWidth="4"/>
      
      {/* Singles sidelines */}
      <line x1="150" y1="55" x2="150" y2="645" stroke="white" strokeWidth="3"/>
      <line x1="1050" y1="55" x2="1050" y2="645" stroke="white" strokeWidth="3"/>
      
      {/* Net */}
      <line x1="600" y1="35" x2="600" y2="665" stroke="#333333" strokeWidth="4"/>
      <rect x="597" y="35" width="6" height="630" fill="rgba(255,255,255,0.15)"/>
      
      {/* Left service box */}
      <rect x="150" y="175" width="450" height="175" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="150" y="350" width="450" height="175" fill="none" stroke="white" strokeWidth="2"/>
      
      {/* Right service box */}
      <rect x="600" y="175" width="450" height="175" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="600" y="350" width="450" height="175" fill="none" stroke="white" strokeWidth="2"/>
      
      {/* Service lines */}
      <line x1="150" y1="175" x2="1050" y2="175" stroke="white" strokeWidth="2"/>
      <line x1="150" y1="525" x2="1050" y2="525" stroke="white" strokeWidth="2"/>
      
      {/* Center marks */}
      <line x1="75" y1="350" x2="95" y2="350" stroke="white" strokeWidth="3"/>
      <line x1="1105" y1="350" x2="1125" y2="350" stroke="white" strokeWidth="3"/>
      
      {/* Net posts */}
      <circle cx="600" cy="35" r="7" fill="#555"/>
      <circle cx="600" cy="665" r="7" fill="#555"/>

      {/* Goal Target Zones (Web of goals) */}
      {/* Left Goal Fence/Target */}
      <g className="goal-target left">
        <rect x="25" y="280" width="40" height="140" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255,255,255,0.8)" strokeWidth="4" rx="4"/>
        <line x1="35" y1="280" x2="35" y2="420" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
        <line x1="45" y1="280" x2="45" y2="420" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
        <line x1="55" y1="280" x2="55" y2="420" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
        <rect x="65" y="260" width="10" height="180" fill="rgba(255, 100, 100, 0.6)" stroke="white" strokeWidth="2" rx="2" /> {/* Red target line */}
      </g>

      {/* Right Goal Fence/Target */}
      <g className="goal-target right">
        <rect x="1135" y="280" width="40" height="140" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255,255,255,0.8)" strokeWidth="4" rx="4"/>
        <line x1="1145" y1="280" x2="1145" y2="420" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
        <line x1="1155" y1="280" x2="1155" y2="420" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
        <line x1="1165" y1="280" x2="1165" y2="420" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
        <rect x="1125" y="260" width="10" height="180" fill="rgba(255, 100, 100, 0.6)" stroke="white" strokeWidth="2" rx="2" /> {/* Red target line */}
      </g>
    </svg>
  )
}
