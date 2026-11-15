import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutChangeEvent, AccessibilityRole } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { layoutStyles } from '../utils/glassStyles';
import { APPLE_SPRING_CONFIG } from '../hooks/useLiquidAnimation';
import { triggerHaptic } from '../utils/haptics';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface Segment {
  key: string;
  title: string;
  icon?: React.ReactNode;
}

export interface LiquidSegmentedControlProps {
  segments: Segment[];
  activeIndex: number;
  onChange: (index: number) => void;
  haptics?: boolean;
  intensity?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
  textStyle?: any;
  accessibilityLabel?: string;
}

/**
 * Apple iOS Segmented Control with a sliding liquid glass indicator.
 * The indicator uses asymmetric fluid stretching physics while transitioning.
 */
export const LiquidSegmentedControl: React.FC<LiquidSegmentedControlProps> = ({
  segments,
  activeIndex,
  onChange,
  haptics = true,
  intensity = 45,
  height = 34,
  borderRadius = 10,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme, isDark } = useTheme();
  const { reduceMotion } = useLiquidConfig();
  const [layouts, setLayouts] = useState<Array<{ x: number; width: number }>>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const indicatorLeft = useSharedValue(0);
  const indicatorRight = useSharedValue(0);
  const activeWidth = useSharedValue(60);

  useEffect(() => {
    if (layouts.length !== segments.length || !layouts[activeIndex]) return;
    const layout = layouts[activeIndex];
    activeWidth.value = layout.width;
    const targetLeft = layout.x;
    const targetRight = layout.x + layout.width;

    const currentLeft = indicatorLeft.value;
    const isMovingRight = targetLeft > currentLeft;

    if (reduceMotion) {
      indicatorLeft.value = targetLeft;
      indicatorRight.value = targetRight;
      return;
    }

    // Apple asymmetric fluid stretch: leading edge outruns the trailing edge.
    if (isMovingRight) {
      indicatorRight.value = withSpring(targetRight, { damping: 15, stiffness: 130, mass: 0.7 });
      indicatorLeft.value = withSpring(targetLeft, APPLE_SPRING_CONFIG);
    } else {
      indicatorLeft.value = withSpring(targetLeft, { damping: 15, stiffness: 130, mass: 0.7 });
      indicatorRight.value = withSpring(targetRight, APPLE_SPRING_CONFIG);
    }
  }, [activeIndex, layouts, segments.length, reduceMotion]);

  const handleSegmentLayout = (index: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => {
      const next = [...prev];
      next[index] = { x, width };
      return next;
    });
  };

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handlePress = (index: number) => {
    if (index === activeIndex) return;
    if (haptics) triggerHaptic('selection');
    onChange(index);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const width = Math.max(0, indicatorRight.value - indicatorLeft.value);
    const base = activeWidth.value || 60;
    const stretchRatio = base > 0 ? width / base : 1;
    const scaleY = Math.max(0.86, Math.min(1.1, 1 - (stretchRatio - 1) * 0.2));
    return {
      left: indicatorLeft.value,
      width,
      transform: [{ scaleY }],
    };
  });

  const textStyles = useState(() => segments.map(() => ({})))[0];

  return (
    <View style={[styles.outer, style]}>
      <LiquidView
        intensity={intensity}
        borderRadius={borderRadius}
        onLayout={handleContainerLayout}
        style={[
          styles.track,
          {
            height,
            borderRadius,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <View style={styles.row}>
          {layouts.length === segments.length && (
            <Animated.View
              style={[
                styles.indicator,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.92)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 1)',
                  shadowColor: isDark ? '#000' : '#8E8E93',
                },
                indicatorStyle,
              ]}
            />
          )}

          {segments.map((segment, index) => {
            const isActive = index === activeIndex;
            return (
              <Pressable
                key={segment.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={segment.title}
                onLayout={(e) => handleSegmentLayout(index, e)}
                onPress={() => handlePress(index)}
                style={styles.segment}
              >
                <View style={layoutStyles.row}>
                  {segment.icon}
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.segmentText,
                      {
                        color: isActive
                          ? isDark
                            ? '#FFFFFF'
                            : '#1C1C1E'
                          : theme.subtextColor,
                        fontWeight: isActive ? '600' : '500',
                      },
                      textStyle,
                    ]}
                  >
                    {segment.title}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </LiquidView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  track: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    zIndex: 0,
  },
  segment: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 6,
  },
  segmentText: {
    fontSize: 13,
    letterSpacing: -0.08,
  },
});
