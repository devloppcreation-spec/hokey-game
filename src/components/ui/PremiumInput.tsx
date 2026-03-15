import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import './PremiumInput.css'

interface PremiumInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  icon?: React.ReactNode
  size?: 'md' | 'lg' | 'xl'
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ label, error, icon, size = 'lg', className = '', ...props }, ref) => {
    return (
      <div className={`premium-input-wrapper premium-input-${size} ${className}`}>
        {label && <label className="input-label">{label}</label>}
        
        <div className={`input-container ${error ? 'has-error' : ''}`}>
          <div className="input-background" />
          
          {icon && <span className="input-icon">{icon}</span>}
          
          <input
            ref={ref}
            className="premium-input"
            {...props}
          />
          
          <div className="input-focus-ring" />
        </div>
        
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }
)
