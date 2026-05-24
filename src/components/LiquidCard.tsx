import React from 'react';
import { StyleSheet, ViewStyle, GestureResponderEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { LiquidView, LiquidViewProps } from './LiquidView';
import { use3DTiltAnimation, useShineAnimation, usePressAnimation } from '../hooks/useLiquidAnimation';
import { glassStyles, layoutStyles } from '../utils/glassStyles';
import { useTheme } from '../hooks/useTheme';

export interface LiquidCardProps extends LiquidViewProps {
  interactive?: boolean;        // 3D parallax tilt and hover effect
  shineSpeed?: number;          // Speed of continuous specular shine in ms (0 to disable)
  shineOnTouch?: boolean;       // Flash shine sweep when tapped
  shadowDepth?: 'low' | 'medium' | 'high';
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(Svg);

export const LiquidCard: React.FC<LiquidCardProps> = ({
  interactive = true,
  shineSpeed = 4000,
  shineOnTouch = true,
  shadowDepth = 'medium',
  borderRadius = 24,
  intensity = 55,
  borderGlow = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Hooks for interactions
  const { tiltStyle, tiltHandlers, setDimensions } = use3DTiltAnimation(10, 10);
  const { pressStyle, pressHandlers } = usePressAnimation(0.98);
  const { shineProgress, triggerManualShine } = useShineAnimation(
    shineSpeed,
    shineSpeed > 0
  );

  const containerWidth = useSharedValue(300); // Dynamic tracker for shine range

  // Handle layouts to calculate shine displacement offsets and tilt dimensions
  const handleLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    containerWidth.value = width;
    // FIX BUG #8: Provide real card dimensions to the tilt hook
    setDimensions(width, height);
    if (props.onLayout) props.onLayout(e);
  };

  const handleTouchStart = (e: GestureResponderEvent) => {
    if (shineOnTouch) {
      triggerManualShine(700);
    }
  };

  // Specular shine displacement style
  const shineStyle = useAnimatedStyle(() => {
    // Translate diagonal shine band across the card width
    const translateX = interpolate(
      shineProgress.value,
      [-1.5, 1.5],
      [-containerWidth.value * 1.5, containerWidth.value * 1.5]
    );

    return {
      transform: [{ translateX }, { skewX: '-25deg' }],
    };
  });

  // Dynamic shadow style based on depth and active theme
  const cardShadow = glassStyles.shadows[shadowDepth](theme.isDark);

  // Combine interactive elements
  const combinedHandlers = {
    ...(interactive ? tiltHandlers : {}),
    onLayout: handleLayout,
    onTouchStart: handleTouchStart,
  };

  return (
    <Animated.View
      style={[
        styles.shadowWrapper,
        cardShadow,
        interactive && tiltStyle,
        interactive && pressStyle,
        style as ViewStyle,
      ]}
      {...combinedHandlers}
    >
      <LiquidView
        intensity={intensity}
        borderRadius={borderRadius}
        borderGlow={borderGlow}
        tint={props.tint}
        experimentalSkia={props.experimentalSkia}
        glowColor={props.glowColor}
        style={styles.fillCard}
      >
        {/* Specular Diagonal Reflection Layer */}
        {shineSpeed > 0 && (
          <Animated.View
            style={[
              layoutStyles.absoluteFill,
              layoutStyles.overflowHidden,
              { borderRadius },
              shineStyle,
            ]}
            pointerEvents="none"
          >
            <Svg height="100%" width="120%" style={styles.shineSvg}>
              <Defs>
                <LinearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.0} />
                  <Stop offset="35%" stopColor="#ffffff" stopOpacity={0.0} />
                  <Stop offset="50%" stopColor="#ffffff" stopOpacity={theme.isDark ? 0.18 : 0.35} />
                  <Stop offset="65%" stopColor="#ffffff" stopOpacity={0.0} />
                  <Stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#shineGrad)" />
            </Svg>
          </Animated.View>
        )}

        {/* Content Layer */}
        <Animated.View style={styles.content}>{children}</Animated.View>
      </LiquidView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    backgroundColor: 'transparent',
    // 3D layering requires transform-style configurations if available
  },
  fillCard: {
    width: '100%',
    height: '100%',
  },
  shineSvg: {
    opacity: 1,
  },
  content: {
    padding: 20,
    backgroundColor: 'transparent',
  },
});
