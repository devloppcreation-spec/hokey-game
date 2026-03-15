export function BasketballCourt() {
  return (
    <svg viewBox="0 0 1200 700" className="field-svg basketball-court" preserveAspectRatio="none">
      <defs>
        {/* Wood pattern */}
        <pattern id="wood" width="70" height="700" patternUnits="userSpaceOnUse">
          <rect width="35" height="700" fill="#c8894a"/>
          <rect x="35" width="35" height="700" fill="#daa058"/>
        </pattern>
      </defs>
      
      {/* Wood floor */}
      <rect width="1200" height="700" fill="url(#wood)"/>
      
      {/* Court outline */}
      <rect x="50" y="50" width="1100" height="600" fill="none" stroke="#4a3520" strokeWidth="4"/>
      
      {/* Center line */}
      <line x1="600" y1="50" x2="600" y2="650" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Center circle */}
      <circle cx="600" cy="350" r="55" fill="none" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Left three-point line */}
      <path d="M 50 140 L 180 140 A 190 190 0 0 1 180 560 L 50 560" 
            fill="none" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Left key/paint */}
      <rect x="50" y="195" width="180" height="310" fill="rgba(180,60,60,0.25)" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Left free throw circle */}
      <circle cx="230" cy="350" r="55" fill="none" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Left backboard and rim */}
      <line x1="70" y1="310" x2="70" y2="390" stroke="#4a3520" strokeWidth="4"/>
      <circle cx="95" cy="350" r="16" fill="none" stroke="#ff5500" strokeWidth="4"/>
      
      {/* Right three-point line */}
      <path d="M 1150 140 L 1020 140 A 190 190 0 0 0 1020 560 L 1150 560" 
            fill="none" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Right key/paint */}
      <rect x="970" y="195" width="180" height="310" fill="rgba(180,60,60,0.25)" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Right free throw circle */}
      <circle cx="970" cy="350" r="55" fill="none" stroke="#4a3520" strokeWidth="3"/>
      
      {/* Right backboard and rim */}
      <line x1="1130" y1="310" x2="1130" y2="390" stroke="#4a3520" strokeWidth="4"/>
      <circle cx="1105" cy="350" r="16" fill="none" stroke="#ff5500" strokeWidth="4"/>

      {/* Goal Target Zones (Web of goals) */}
      {/* Left Goal Hoop Zone */}
      <g className="goal-target left">
        {/* Support structure / Backboard edge */}
        <rect x="15" y="280" width="15" height="140" fill="#333" stroke="#111" strokeWidth="2" rx="4" />
        <rect x="30" y="325" width="20" height="50" fill="rgba(255, 255, 255, 0.4)" stroke="white" strokeWidth="3" rx="4" /> {/* Backboard glass */}
        {/* Hoop rim on the ground */}
        <path d="M 50 350 A 40 50 0 1 1 50 349.9" fill="rgba(255, 69, 0, 0.15)" stroke="#ff4500" strokeWidth="6" />
        {/* Net lines */}
        <path d="M 50 310 Q 75 350 50 390 M 35 320 Q 55 350 35 380 M 65 325 Q 85 350 65 375" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <rect x="50" y="260" width="8" height="180" fill="rgba(255, 100, 100, 0.6)" stroke="white" strokeWidth="2" rx="2" /> {/* Red target line */}
      </g>

      {/* Right Goal Hoop Zone */}
      <g className="goal-target right">
        {/* Support structure / Backboard edge */}
        <rect x="1170" y="280" width="15" height="140" fill="#333" stroke="#111" strokeWidth="2" rx="4" />
        <rect x="1150" y="325" width="20" height="50" fill="rgba(255, 255, 255, 0.4)" stroke="white" strokeWidth="3" rx="4" /> {/* Backboard glass */}
        {/* Hoop rim on the ground */}
        <path d="M 1150 350 A 40 50 0 1 0 1150 350.1" fill="rgba(255, 69, 0, 0.15)" stroke="#ff4500" strokeWidth="6" />
        {/* Net lines */}
        <path d="M 1150 310 Q 1125 350 1150 390 M 1165 320 Q 1145 350 1165 380 M 1135 325 Q 1115 350 1135 375" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <rect x="1142" y="260" width="8" height="180" fill="rgba(255, 100, 100, 0.6)" stroke="white" strokeWidth="2" rx="2" /> {/* Red target line */}
      </g>
    </svg>
  )
}
