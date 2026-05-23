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
  background: '#0B0B0E', // Sleek VisionOS deep obsidian
  glassFill: 'rgba(20, 20, 25, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glowColor: 'rgba(138, 43, 226, 0.35)', // Vibrant neon purple
  textColor: '#F5F5F7',
  subtextColor: '#A1A1A6',
  accentColor: '#BF5AF2', // VisionOS neon purple/pink
  accentGlow: 'rgba(191, 90, 242, 0.45)',
  shadowColor: 'rgba(0, 0, 0, 0.45)',
};
