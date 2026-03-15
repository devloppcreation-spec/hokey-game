import React from 'react';
import './SportSelector3D.css';

export interface Sport {
  id: string;
  name: string;
  icon: string;
  description?: string;
  gradient?: string;
  accentColor?: string;
}

export interface SportSelector3DProps {
  sports: Sport[];
  selectedSportId: string | null;
  onSelect: (id: string) => void;
}

export const SportSelector3D: React.FC<SportSelector3DProps> = ({
  sports,
  selectedSportId,
  onSelect
}) => {
  return (
    <div className="sports-grid">
      {sports.map((sport, index) => {
        const isSelected = selectedSportId === sport.id;
        return (
          <button
            key={sport.id}
            className={`sport-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(sport.id)}
            style={{
              '--gradient': sport.gradient,
              '--accent': sport.accentColor,
              '--delay': `${index * 100}ms`
            } as React.CSSProperties}
          >
            {/* Background glow */}
            <div className="card-glow" />
            
            {/* Icon */}
            <div className="sport-icon-large">
              {sport.icon}
            </div>
            
            {/* Name */}
            <h3 className="sport-name">{sport.name}</h3>
            
            {/* Description */}
            <p className="sport-desc">{sport.description}</p>
            
            {/* Hover shine effect */}
            <div className="card-shine" />
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="selection-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
