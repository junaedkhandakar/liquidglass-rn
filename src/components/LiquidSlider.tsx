import React, { useState } from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { layoutStyles } from '../utils/glassStyles';
import { APPLE_SPRING_CONFIG, APPLE_BOUNCE_CONFIG } from '../hooks/useLiquidAnimation';
import { triggerHaptic } from '../utils/haptics';

export interface LiquidSliderProps {
  value?: number; // 0 to 1
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  haptics?: boolean;
  disabled?: boolean;
  height?: number;
  borderRadius?: number;
  intensity?: number;
  icon?: React.ReactNode;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const LiquidSlider: React.FC<LiquidSliderProps> = ({
  value,
  defaultValue = 0.5,
  onValueChange,
  haptics = true,
  disabled = false,
  height = 56,
  borderRadius = 22,
  intensity = 50,
  icon,
  label,
  style,
  labelStyle,
}) => {
  const { theme, isDark } = useTheme();
  const [trackWidth, setTrackWidth] = useState(240);

  const initialVal = value !== undefined ? value : defaultValue;
  const progress = useSharedValue(Math.max(0, Math.min(1, initialVal)));
  const isPressing = useSharedValue(false);
  const dragStartX = useSharedValue(0);
  const startProgress = useSharedValue(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const notifyChange = (v: number) => {
    if (onValueChange) {
      onValueChange(v);
    }
  };

  const fireHaptic = () => {
    if (haptics) {
      triggerHaptic('selection');
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart((e) => {
      isPressing.value = true;
      dragStartX.value = e.x;
      startProgress.value = progress.value;
      runOnJS(fireHaptic)();
    })
    .onUpdate((e) => {
      if (trackWidth <= 0) return;
      const deltaX = e.x - dragStartX.value;
      const newProgress = Math.max(0, Math.min(1, startProgress.value + deltaX / trackWidth));
      progress.value = newProgress;
      runOnJS(notifyChange)(newProgress);
    })
    .onEnd(() => {
      isPressing.value = false;
      runOnJS(fireHaptic)();
    });

  const fillStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const containerSpringStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isPressing.value ? 1.02 : 1, APPLE_BOUNCE_CONFIG),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.sliderWrapper, containerSpringStyle, style]}>
      <LiquidView
        intensity={intensity}
        borderRadius={borderRadius}
        onLayout={handleLayout}
        style={[
          styles.track,
          {
            height,
            borderRadius,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <View style={StyleSheet.absoluteFill}>
            {/* Luminous Liquid Glass Fill */}
            <Animated.View
              style={[
                styles.fill,
                {
                  borderRadius,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.75)',
                  borderRightColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.95)',
                },
                fillStyle,
              ]}
            />

            {/* Label and Icon Content */}
            <View style={[layoutStyles.row, styles.contentContainer]} pointerEvents="none">
              <View style={layoutStyles.row}>
                {icon && <View style={styles.iconSlot}>{icon}</View>}
                {label && (
                  <Text
                    style={[
                      styles.labelText,
                      { color: theme.textColor },
                      labelStyle,
                    ]}
                  >
                    {label}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </GestureDetector>
      </LiquidView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sliderWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  track: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1.5,
    borderCurve: 'continuous',
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconSlot: {
    marginRight: 10,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
