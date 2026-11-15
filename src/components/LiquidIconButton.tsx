import React from 'react';
import { StyleSheet, Pressable, View, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { triggerHaptic } from '../utils/haptics';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidIconButtonProps {
  icon?: React.ReactNode;
  onPress?: () => void;
  size?: number;
  variant?: 'glass' | 'filled' | 'tinted';
  tintColor?: string;
  haptics?: boolean;
  disabled?: boolean;
  intensity?: number;
  glow?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Circular Apple-style glass icon button.
 */
export const LiquidIconButton: React.FC<LiquidIconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  variant = 'glass',
  tintColor,
  haptics = true,
  disabled = false,
  intensity = 45,
  glow = false,
  accessibilityLabel,
  style,
  children,
}) => {
  const { theme, isDark } = useTheme();
  const { reduceMotion } = useLiquidConfig();
  const pressed = useSharedValue(0);

  const handlePressIn = () => {
    pressed.value = reduceMotion ? 0 : withSpring(1, { damping: 14, stiffness: 240 });
    if (haptics) triggerHaptic('impactLight');
  };

  const handlePressOut = () => {
    pressed.value = reduceMotion ? 0 : withSpring(0, { damping: 18, stiffness: 200 });
  };

  const pressStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - pressed.value * 0.1 },
      { scaleX: 1 + pressed.value * 0.06 },
    ],
  }));

  const getBackground = () => {
    if (variant === 'filled') return theme.accentColor;
    if (variant === 'tinted') return tintColor ?? theme.accentColor;
    return isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.55)';
  };

  const getBorder = () => {
    if (variant === 'filled') return 'rgba(255, 255, 255, 0.2)';
    if (variant === 'tinted') return 'rgba(255, 255, 255, 0.18)';
    return isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.8)';
  };

  return (
    <Animated.View style={[styles.wrapper, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
      >
        <Animated.View style={pressStyle}>
          <LiquidView
            intensity={variant === 'filled' ? 0 : intensity}
            borderRadius={size / 2}
            borderGlow={glow}
            glowColor={tintColor ?? theme.accentGlow}
            style={[
              styles.button,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: getBackground(),
                borderColor: getBorder(),
              },
            ]}
          >
            <View style={styles.content}>{icon ?? children}</View>
          </LiquidView>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
