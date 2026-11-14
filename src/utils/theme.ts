export interface LiquidThemeColors {
  isDark: boolean;
  background: string;
  glassFill: string;
  glassBorder: string;
  glowColor: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  accentGlow: string;
  shadowColor: string;
}

export const lightTheme: LiquidThemeColors = {
  isDark: false,
  background: '#EAEBF0', // Clean premium iOS light grey
  glassFill: 'rgba(255, 255, 255, 0.45)',
  glassBorder: 'rgba(255, 255, 255, 0.65)',
  glowColor: 'rgba(138, 43, 226, 0.15)', // Subtle amethyst purple
  textColor: '#1C1C1E',
  subtextColor: '#8E8E93',
  accentColor: '#007AFF', // Classic apple blue
  accentGlow: 'rgba(0, 122, 255, 0.35)',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
};

export const darkTheme: LiquidThemeColors = {
  isDark: true,
  background: '#000000', // Apple iOS true OLED black
  glassFill: 'rgba(255, 255, 255, 0.11)', // Apple iOS Control Center thin glass fill
  glassBorder: 'rgba(255, 255, 255, 0.18)', // Apple iOS crisp hairline border
  glowColor: 'rgba(255, 255, 255, 0.15)', // Subtle specular edge sheen
  textColor: '#FFFFFF',
  subtextColor: '#8E8E93', // iOS secondary label grey
  accentColor: '#0A84FF', // Apple iOS system blue
  accentGlow: 'rgba(10, 132, 255, 0.35)',
  shadowColor: 'rgba(0, 0, 0, 0.35)',
};
