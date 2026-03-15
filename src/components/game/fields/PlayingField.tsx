import { HockeyRink } from './HockeyRink'
import { SoccerField } from './SoccerField'
import { BasketballCourt } from './BasketballCourt'
import { TennisCourt } from './TennisCourt'
import { VolleyballCourt } from './VolleyballCourt'

interface PlayingFieldProps {
  sport: string
}

/**
 * PlayingField - renders the raw SVG field for the selected sport.
 * All 3D perspective, edges, shadows are handled by PremiumPlayingField.
 * This component MUST NOT add any wrappers with padding/margins/transforms
 * to avoid coordinate offsets between the field and game objects.
 */
export function PlayingField({ sport }: PlayingFieldProps) {
  switch (sport) {
    case 'hockey':
      return <HockeyRink />
    case 'soccer':
      return <SoccerField />
    case 'basketball':
      return <BasketballCourt />
    case 'tennis':
      return <TennisCourt />
    case 'volleyball':
      return <VolleyballCourt />
    default:
      return <HockeyRink />
  }
}
