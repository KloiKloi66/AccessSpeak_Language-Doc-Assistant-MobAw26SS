// Figma Design Tokens – AccessSpeak
export const COLORS = {
  // Backgrounds
  background: '#1A1929',
  surface: '#252440',
  surfaceLight: '#2E2B50',

  // Accent
  accent: '#6655CC',
  accentMuted: 'rgba(102, 85, 204, 0.3)',

  // Text
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.55)',
  textSecondary: 'rgba(255,255,255,0.8)',

  // Borders / Dividers
  border: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.15)',

  // Difficulty badges
  badgeRed: '#CC3333',
  badgeRedBg: 'rgba(204, 51, 51, 0.20)',
  badgeGreen: '#44AA66',
  badgeGreenBg: 'rgba(68, 170, 102, 0.20)',
  badgeAmber: '#CC8822',
  badgeAmberBg: 'rgba(204, 136, 34, 0.20)',
} as const;

export const RADIUS = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 9999,
} as const;

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
} as const;
