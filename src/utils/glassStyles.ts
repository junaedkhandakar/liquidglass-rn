import { StyleSheet, ViewStyle, Platform } from 'react-native';

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
  
  // High fidelity multi-layer soft shadows for 3D depth optimized for iOS and Android
  shadows: {
    low: (isDark: boolean) =>
      Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.05,
          shadowRadius: 8,
        },
        android: {
          elevation: isDark ? 2 : 1,
        },
        default: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.25 : 0.05,
          shadowRadius: 8,
        },
      }) as ViewStyle,
    medium: (isDark: boolean) =>
      Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 16,
        },
        android: {
          elevation: isDark ? 4 : 2,
        },
        default: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 16,
        },
      }) as ViewStyle,
    high: (isDark: boolean) =>
      Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: isDark ? 0.45 : 0.12,
          shadowRadius: 24,
        },
        android: {
          elevation: isDark ? 6 : 3,
        },
        default: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: isDark ? 0.45 : 0.12,
          shadowRadius: 24,
        },
      }) as ViewStyle,
  },

  // Glowing borders/rims
  glows: {
    accent: (color: string) =>
      Platform.select({
        ios: {
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
        },
        android: {
          elevation: 4,
        },
        default: {
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
        },
      }) as ViewStyle,
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
