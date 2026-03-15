import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './PremiumButton.css'

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  glow?: boolean
  fullWidth?: boolean
}

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'left',
  loading = false,
  glow = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={`
        premium-button
        premium-button-${variant}
        premium-button-${size}
        ${glow ? 'with-glow' : ''}
        ${fullWidth ? 'full-width' : ''}
        ${loading ? 'loading' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      <span className="button-background" />
      <span className="button-highlight" />
      
      <span className="button-content">
        {loading ? (
          <span className="loading-spinner" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="button-icon">{icon}</span>
            )}
            <span className="button-text">{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="button-icon">{icon}</span>
            )}
          </>
        )}
      </span>
      
      <span className="button-shine" />
      {glow && <span className="button-glow" />}
    </button>
  )
}
