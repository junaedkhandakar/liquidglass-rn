import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidProgressBarProps {
  progress?: number; // 0 to 1
  height?: number;
  borderRadius?: number;
  color?: string;
  trackColor?: string;
  indeterminate?: boolean;
  style?: ViewStyle;
}

export interface LiquidSpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Apple-style liquid glass progress bar with a specular leading edge.
 */
export const LiquidProgressBar: React.FC<LiquidProgressBarProps> = ({
  progress = 0,
  height = 6,
  borderRadius = 3,
  color,
  trackColor,
  indeterminate = false,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const { reduceMotion } = useLiquidConfig();
  const value = useSharedValue(Math.max(0, Math.min(1, progress)));
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (indeterminate) {
      if (reduceMotion) return;
      sweep.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
    }
  }, [indeterminate, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      value.value = Math.max(0, Math.min(1, progress));
    } else {
      value.value = withSpring(Math.max(0, Math.min(1, progress)), { damping: 20, stiffness: 160 });
    }
  }, [progress, reduceMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${value.value * 100}%`,
  }));

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweep.value * 220 - 40 }],
  }));

  const accent = color ?? theme.accentColor;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius,
          backgroundColor: trackColor ?? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(118,118,128,0.16)'),
        },
        style,
      ]}
    >
      {indeterminate ? (
        <Animated.View style={[styles.sweep, sweepStyle]}>
          <View
            style={{
              width: '40%',
              height: '100%',
              borderRadius,
              backgroundColor: accent,
              opacity: 0.85,
            }}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.fill,
            {
              borderRadius,
              backgroundColor: accent,
              shadowColor: accent,
            },
            fillStyle,
          ]}
        />
      )}
    </View>
  );
};

/**
 * Apple-style rotating activity indicator built from liquid glass arcs.
 */
export const LiquidSpinner: React.FC<LiquidSpinnerProps> = ({
  size = 24,
  color,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const { reduceMotion } = useLiquidConfig();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    );
  }, [reduceMotion]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const accent = color ?? theme.accentColor;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Animated.View style={[styles.spinner, { width: size, height: size }, spinStyle]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: size / 2 - 1.5,
              width: 3,
              height: size * 0.26,
              borderRadius: 2,
              backgroundColor: accent,
              opacity: 0.15 + (i / 5) * 0.85,
              transform: [{ rotate: `${i * 60}deg` }, { translateY: 0 }],
              transformOrigin: 'center bottom',
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '40%',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
