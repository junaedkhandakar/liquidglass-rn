import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { triggerHaptic } from '../utils/haptics';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  haptics?: boolean;
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  knobColor?: string;
  style?: any;
  accessibilityLabel?: string;
}

/**
 * Apple iOS Toggle Switch with a liquid glass knob that stretches while travelling.
 */
export const LiquidSwitch: React.FC<LiquidSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  haptics = true,
  width = 51,
  height = 31,
  activeColor,
  inactiveColor,
  knobColor = '#FFFFFF',
  style,
  accessibilityLabel,
}) => {
  const { theme, isDark } = useTheme();
  const { reduceMotion } = useLiquidConfig();

  const progress = useSharedValue(value ? 1 : 0);
  const trackWidth = useSharedValue(width);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = value ? 1 : 0;
    } else {
      progress.value = withSpring(value ? 1 : 0, { damping: 18, stiffness: 190, mass: 0.7 });
    }
  }, [value, reduceMotion]);

  const handleLayout = (e: LayoutChangeEvent) => {
    trackWidth.value = e.nativeEvent.layout.width;
  };

  const handlePress = () => {
    if (disabled) return;
    if (haptics) triggerHaptic('selection');
    onValueChange(!value);
  };

  const knobSize = height - 4;

  const knobStyle = useAnimatedStyle(() => {
    const travel = Math.max(0, trackWidth.value - knobSize - 4);
    const x = 2 + progress.value * travel;
    // The knob stretches slightly while travelling, like a liquid droplet.
    const stretch = 1 + Math.sin(progress.value * Math.PI) * 0.12;
    return {
      transform: [
        { translateX: x },
        { scaleX: stretch },
        { scaleY: 2 - stretch },
      ],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    const base = inactiveColor ?? (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(120,120,128,0.16)');
    const active = activeColor ?? theme.accentColor;
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], [base, active]),
    };
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.outer, style]}
    >
      <Animated.View
        onLayout={handleLayout}
        style={[
          styles.track,
          { width, height, borderRadius: height / 2 },
          trackStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
              backgroundColor: knobColor,
              shadowOpacity: isDark ? 0.35 : 0.22,
            },
            knobStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: 'transparent',
  },
  track: {
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  knob: {
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  disabled: {
    opacity: 0.45,
  },
});
