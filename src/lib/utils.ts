
import { RiskLevel } from '../types'

export function riskColor(level: RiskLevel): string {
  const theme = document.documentElement.getAttribute('data-theme')
  if (theme === 'colorblind') {
    switch(level) {
      case 'Alto': return '#D55E00'
      case 'Medio': return '#E69F00'
      case 'Bajo': return '#009E73'
      default: return '#0072B2'
    }
  }
  switch(level) {
    case 'Alto': return '#ff6b6b'
    case 'Medio': return '#ffbf4f'
    case 'Bajo': return '#38d39f'
    default: return '#7aa2ff'
  }
}
