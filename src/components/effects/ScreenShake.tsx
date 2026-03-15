import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './ScreenShake.css'

interface ScreenShakeProps {
  children: ReactNode
  trigger: number
  intensity?: 'light' | 'medium' | 'heavy'
}

export function ScreenShake({ children, trigger, intensity = 'medium' }: ScreenShakeProps) {
  const [isShaking, setIsShaking] = useState(false)
  
  useEffect(() => {
    if (trigger > 0) {
      setIsShaking(true)
      const timer = setTimeout(() => setIsShaking(false), 500)
      return () => clearTimeout(timer)
    }
  }, [trigger])
  
  return (
    <div className={`screen-shake ${isShaking ? `shaking-${intensity}` : ''}`}>
      {children}
    </div>
  )
}
