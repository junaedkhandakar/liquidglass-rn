import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { triggerHaptic } from '../utils/haptics';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidRatingProps {
  value: number;
  onValueChange?: (value: number) => void;
  max?: number;
  size?: number;
  haptics?: boolean;
  intensity?: number;
  style?: any;
  accessibilityLabel?: string;
}

/**
 * Apple style star rating rendered as frosted glass stars.
 * Tapping a star sets the rating, dragging scrubs it continuously.
 */
export const LiquidRating: React.FC<LiquidRatingProps> = ({
  value,
  onValueChange,
  max = 5,
  size = 36,
  haptics = true,
  intensity = 40,
  style,
  accessibilityLabel = 'Rating',
}) => {
  const { theme, isDark } = useTheme();
  const { haptics: globalHaptics, reduceMotion } = useLiquidConfig();
  const useHaptics = haptics && globalHaptics;

  const [width, setWidth] = useState(0);
  const fillRatio = useSharedValue(value / max);
  const pressRatio = useSharedValue(value / max);

  const applyValue = (ratio: number) => {
    const next = Math.max(0, Math.min(max, Math.round(ratio * max)));
    if (next !== value && onValueChange) {
      if (useHaptics) triggerHaptic('selection');
      onValueChange(next);
    }
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handlePress = (index: number) => {
    applyValue((index + 1) / max);
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(1, fillRatio.value)) * 100}%`,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : 1 + (pressRatio.value - value / max) * 0.04 }],
  }));

  return (
    <Animated.View
      style={[styles.container, containerStyle, style]}
      onLayout={handleLayout}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max, now: value }}
    >
      {Array.from({ length: max }).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => handlePress(index)}
          onPressIn={() => {
            pressRatio.value = (index + 1) / max;
          }}
          onPressOut={() => {
            pressRatio.value = value / max;
          }}
          accessibilityRole="button"
          accessibilityLabel={`${index + 1} star${index === 0 ? '' : 's'}`}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          style={styles.starWrapper}
        >
          <LiquidView
            intensity={intensity}
            borderRadius={size / 2}
            style={[
              styles.star,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)',
                borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <Text
              style={[
                styles.glyph,
                { fontSize: size * 0.5, color: isDark ? '#FFD60A' : '#FF9F0A' },
              ]}
            >
              ★
            </Text>
          </LiquidView>
        </Pressable>
      ))}

      {/* Continuous fill overlay driven by the drag position */}
      {width > 0 && (
        <View style={styles.fillTrack} pointerEvents="none">
          <Animated.View
            style={[
              styles.fill,
              { backgroundColor: isDark ? 'rgba(255,214,10,0.14)' : 'rgba(255,159,10,0.16)' },
              fillStyle,
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  starWrapper: {
    marginRight: 6,
  },
  star: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  glyph: {
    lineHeight: undefined,
  },
  fillTrack: {
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    height: '100%',
  },
});
