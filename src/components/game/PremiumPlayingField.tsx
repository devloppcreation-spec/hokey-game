import type { SportType } from '../../types/sportTheme.types'
import type { ReactNode } from 'react'
import { getSportTheme } from '../../themes/sportThemes'
import { PlayingField } from './fields/PlayingField'
import './PremiumPlayingField.css'

interface PremiumPlayingFieldProps {
  sport: SportType
  width?: number
  height?: number
  showReflections?: boolean
  children?: ReactNode
}

export function PremiumPlayingField({
  sport,
  width = 1200,
  height = 700,
  showReflections = true,
  children
}: PremiumPlayingFieldProps) {
  const theme = getSportTheme(sport)
  
  return (
    <div 
      className="premium-field-container"
      style={{ 
        '--field-width': `${width}px`,
        '--field-height': `${height}px`,
        '--field-primary': theme.field.backgroundColor,
        '--field-lines': theme.field.lineColor,
        '--field-accent': theme.field.borderColor
      } as React.CSSProperties}
    >
      {/* 3D Perspective Wrapper */}
      <div className="field-3d-wrapper">
        <div className="field-surface" style={{ background: 'transparent' }}>
          {/* 3D edge elements */}
          <div className="field-edge-left" />
          <div className="field-edge-right" />
          <div className="field-edge-bottom" />
          
          {/* Main Field Surface - SVG Rendered */}
          <PlayingField sport={sport} />
          
          {/* Sport Specific 3D Overlays */}
          {sport === 'basketball' && (
             <>
                <div className="basketball-hoop left" />
                <div className="basketball-hoop right" />
             </>
          )}
          {(sport === 'tennis' || sport === 'volleyball') && (
             <div className="center-net" />
          )}
          
          {/* Injected Game Canvas Layer for logic and players */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'hidden', borderRadius: '16px' }}>
            {children}
          </div>

          {/* Ice/Surface Reflections */}
          {showReflections && (
            <div className="field-reflections" style={{ pointerEvents: 'none' }}>
              <div className="reflection-streak reflection-1" />
              <div className="reflection-streak reflection-2" />
              <div className="reflection-streak reflection-3" />
            </div>
          )}
          
          {/* Ambient Light Overlay */}
          <div className="field-ambient-light" style={{ pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  )
}
