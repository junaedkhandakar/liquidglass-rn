import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { triggerHaptic } from '../utils/haptics';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  haptics?: boolean;
  intensity?: number;
  height?: number;
  label?: string;
  style?: any;
  labelStyle?: any;
}

/**
 * Apple iOS Stepper control rendered as a frosted glass capsule.
 * Drag up or down on the glass body to scrub the value.
 */
export const LiquidStepper: React.FC<LiquidStepperProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 10,
  step = 1,
  haptics = true,
  intensity = 45,
  height = 40,
  label,
  style,
  labelStyle,
}) => {
  const { theme, isDark } = useTheme();
  const { haptics: globalHaptics, reduceMotion } = useLiquidConfig();
  const useHaptics = haptics && globalHaptics;

  const dragStartValue = useSharedValue(value);
  const dragDelta = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const setValue = (next: number) => {
    const clamped = Math.max(min, Math.min(max, next));
    if (clamped !== value) {
      if (useHaptics) triggerHaptic('selection');
      onValueChange(clamped);
    }
  };

  const stepBy = (delta: number) => {
    setValue(Math.round((value + delta) * 100) / 100);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      dragStartValue.value = value;
      dragDelta.value = 0;
    })
    .onUpdate((e) => {
      dragDelta.value = e.translationY;
      const raw = dragStartValue.value - e.translationY / 12;
      const clamped = Math.max(min, Math.min(max, raw));
      runOnJS(setValue)(Math.round(clamped * 100) / 100);
    })
    .onEnd(() => {
      isDragging.value = false;
      dragDelta.value = 0;
    });

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: dragDelta.value * 0.18 },
      { scale: isDragging.value ? 1.03 : 1 },
    ],
  }));

  return (
    <View style={[styles.outer, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.textColor }, labelStyle]}>{label}</Text>
      ) : null}

      <View style={styles.row}>
        <Pressable
          onPress={() => stepBy(-step)}
          accessibilityRole="button"
          accessibilityLabel="Decrease"
          style={[styles.stepButton, { borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.1)' }]}
        >
          <Text style={[styles.stepGlyph, { color: theme.textColor }]}>−</Text>
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={bodyStyle}>
            <LiquidView
              intensity={intensity}
              borderRadius={12}
              style={[
                styles.valueBox,
                {
                  height,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.6)',
                  borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.07)',
                },
              ]}
            >
              <Text style={[styles.valueText, { color: theme.textColor }]}>{value}</Text>
            </LiquidView>
          </Animated.View>
        </GestureDetector>

        <Pressable
          onPress={() => stepBy(step)}
          accessibilityRole="button"
          accessibilityLabel="Increase"
          style={[styles.stepButton, { borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.1)' }]}
        >
          <Text style={[styles.stepGlyph, { color: theme.textColor }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  stepGlyph: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
  },
  valueBox: {
    minWidth: 56,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
