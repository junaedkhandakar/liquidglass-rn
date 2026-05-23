import { StyleSheet, ViewStyle } from 'react-native';

export const glassStyles = {
  borders: {
    light: {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.65)',
    },
    dark: {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  
  // High fidelity multi-layer soft shadows for 3D depth
  shadows: {
    low: (isDark: boolean) => ({
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 8,
      elevation: 4,
    }),
    medium: (isDark: boolean) => ({
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.35 : 0.08,
      shadowRadius: 16,
      elevation: 8,
    }),
    high: (isDark: boolean) => ({
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: isDark ? 0.45 : 0.12,
      shadowRadius: 24,
      elevation: 16,
    }),
  },

  // Glowing borders/rims
  glows: {
    accent: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 6,
    }),
  },
};

export const layoutStyles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});
