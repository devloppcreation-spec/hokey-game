import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './PremiumModal.css'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  showCloseButton?: boolean
}

export function PremiumModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}: PremiumModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return createPortal(
    <div className="premium-modal-overlay" onClick={onClose}>
      <div 
        className={`premium-modal premium-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background effects */}
        <div className="modal-glow" />
        <div className="modal-background" />
        
        {/* Header */}
        {(title || showCloseButton) && (
          <header className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button className="modal-close" onClick={onClose}>
                <span>✕</span>
              </button>
            )}
          </header>
        )}
        
        {/* Content */}
        <div className="modal-content">
          {children}
        </div>
        
        {/* Shine effect */}
        <div className="modal-shine" />
      </div>
    </div>,
    document.body
  )
}
