import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';

export interface LiquidToolbarProps {
  title?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  center?: React.ReactNode;
  intensity?: number;
  height?: number;
  bordered?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Apple iOS toolbar rendered as a frosted glass bar.
 */
export const LiquidToolbar: React.FC<LiquidToolbarProps> = ({
  title,
  leading,
  trailing,
  center,
  intensity = 60,
  height = 52,
  bordered = true,
  style,
  contentStyle,
}) => {
  const { theme, isDark } = useTheme();

  return (
    <LiquidView
      intensity={intensity}
      borderRadius={0}
      style={[
        styles.toolbar,
        {
          height,
          borderBottomWidth: bordered ? 1 : 0,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
        },
        style,
      ]}
    >
      <View style={[styles.row, contentStyle]}>
        <View style={styles.side}>{leading}</View>

        <View style={styles.center}>
          {center ?? (
            <Text numberOfLines={1} style={[styles.title, { color: theme.textColor }]}>
              {title}
            </Text>
          )}
        </View>

        <View style={[styles.side, styles.trailing]}>{trailing}</View>
      </View>
    </LiquidView>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    width: '100%',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
  },
  side: {
    minWidth: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  trailing: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
});
