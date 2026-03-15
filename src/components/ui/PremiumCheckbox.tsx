import './PremiumCheckbox.css'

interface PremiumCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  size?: 'md' | 'lg'
}

export function PremiumCheckbox({
  checked,
  onChange,
  label,
  size = 'lg'
}: PremiumCheckboxProps) {
  return (
    <label className={`premium-checkbox premium-checkbox-${size}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkbox-box">
        <span className="checkbox-check">✓</span>
        <span className="checkbox-glow" />
      </span>
      <span className="checkbox-label">{label}</span>
    </label>
  )
}
