import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';

export interface LiquidBadgeProps {
  label: string;
  count?: number;
  variant?: 'glass' | 'filled' | 'tinted';
  tintColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: any;
}

/**
 * Apple style glass badge for status labels and counters.
 */
export const LiquidBadge: React.FC<LiquidBadgeProps> = ({
  label,
  count,
  variant = 'glass',
  tintColor,
  size = 'medium',
  style,
  textStyle,
}) => {
  const { theme, isDark } = useTheme();

  const dims = {
    small: { paddingVertical: 2, paddingHorizontal: 7, fontSize: 10, radius: 7 },
    medium: { paddingVertical: 3, paddingHorizontal: 9, fontSize: 12, radius: 9 },
    large: { paddingVertical: 5, paddingHorizontal: 12, fontSize: 14, radius: 12 },
  }[size];

  const isFilled = variant === 'filled';
  const isTinted = variant === 'tinted';

  const background = isFilled
    ? tintColor ?? theme.accentColor
    : isTinted
    ? `${tintColor ?? theme.accentColor}33`
    : isDark
    ? 'rgba(255,255,255,0.14)'
    : 'rgba(255,255,255,0.65)';

  const borderColor = isFilled
    ? 'rgba(255,255,255,0.22)'
    : isTinted
    ? `${tintColor ?? theme.accentColor}55`
    : isDark
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(255,255,255,0.8)';

  const textColor = isFilled ? '#FFFFFF' : isTinted ? tintColor ?? theme.accentColor : theme.textColor;

  return (
    <LiquidView
      intensity={isFilled ? 0 : 35}
      borderRadius={dims.radius}
      style={[
        styles.badge,
        {
          paddingVertical: dims.paddingVertical,
          paddingHorizontal: dims.paddingHorizontal,
          backgroundColor: background,
          borderColor,
          borderRadius: dims.radius,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: dims.fontSize },
            textStyle,
          ]}
        >
          {label}
        </Text>
        {count !== undefined && count > 0 && (
          <View style={[styles.count, { backgroundColor: isFilled ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)' }]}>
            <Text style={[styles.countText, { color: textColor, fontSize: dims.fontSize - 1 }]}>
              {count > 99 ? '99+' : count}
            </Text>
          </View>
        )}
      </View>
    </LiquidView>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  count: {
    marginLeft: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    fontWeight: '700',
  },
});
