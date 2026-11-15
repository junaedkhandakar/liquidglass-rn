import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';

export interface LiquidAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  action?: React.ReactNode;
  onDismiss?: () => void;
  intensity?: number;
  style?: ViewStyle;
}

const VARIANT_COLORS: Record<string, string> = {
  info: '#0A84FF',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
};

const VARIANT_GLYPHS: Record<string, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '×',
};

/**
 * Apple style frosted glass inline banner.
 */
export const LiquidAlert: React.FC<LiquidAlertProps> = ({
  visible,
  title,
  message,
  variant = 'info',
  action,
  onDismiss,
  intensity = 40,
  style,
}) => {
  const { theme, isDark } = useTheme();

  if (!visible) return null;

  const accent = VARIANT_COLORS[variant] ?? VARIANT_COLORS.info;

  return (
    <LiquidView
      intensity={intensity}
      borderRadius={18}
      style={[
        styles.alert,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
          borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.06)',
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <Text style={styles.badgeText}>{VARIANT_GLYPHS[variant]}</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.textColor }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: theme.subtextColor }]}>{message}</Text>
          ) : null}
        </View>

        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
    </LiquidView>
  );
};

const styles = StyleSheet.create({
  alert: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 17,
  },
  action: {
    marginLeft: 10,
  },
});
