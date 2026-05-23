import React, { useState } from 'react';
import { StyleSheet, Pressable, PressableProps, Text, ViewStyle, TextStyle, GestureResponderEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { Canvas, Circle, Blur, ColorMatrix } from '@shopify/react-native-skia';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { LiquidView } from './LiquidView';
import { usePressAnimation, useShineAnimation } from '../hooks/useLiquidAnimation';
import { useTheme } from '../hooks/useTheme';
import { glassStyles, layoutStyles } from '../utils/glassStyles';
import { LIQUID_FUSION_COLOR_MATRIX } from '../shaders/liquidShader';

export interface LiquidButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'glass';
  liquidRipple?: boolean;        // Dynamic Skia liquid circular ripple
  shineOnPress?: boolean;       // Slider specular highlight across button on press
  scaleOnPress?: boolean;       // Tactile bounce scale down
  glow?: boolean;               // Pulsing neon backing glow
  title?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  variant = 'glass',
  liquidRipple = true,
  shineOnPress = true,
  scaleOnPress = true,
  glow = false,
  title,
  style,
  textStyle,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  
  // Interaction animations
  const { pressStyle, pressHandlers, scale } = usePressAnimation(scaleOnPress ? 0.94 : 1);
  const { shineProgress, triggerManualShine } = useShineAnimation(3000, false);
  const [btnWidth, setBtnWidth] = useState(150);
  const [btnHeight, setBtnHeight] = useState(48);

  // Skia Ripple Coordinates & Metrics
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const rippleRadius = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const handleLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setBtnWidth(width);
    setBtnHeight(height);
  };

  const handlePressIn = (e: GestureResponderEvent) => {
    // 1. Trigger tactile spring shrink
    pressHandlers.onPressIn();

    // 2. Trigger shine highlight sweep
    if (shineOnPress) {
      triggerManualShine(600);
    }

    // 3. Trigger Skia liquid ripple from exact touch coordinate
    if (liquidRipple) {
      const { locationX, locationY } = e.nativeEvent;
      touchX.value = locationX;
      touchY.value = locationY;
      rippleRadius.value = 0;
      rippleOpacity.value = 0.6; // Start bright
      
      const maxRadius = Math.max(btnWidth, btnHeight) * 1.5;
      
      rippleRadius.value = withTiming(maxRadius, { duration: 600 });
      rippleOpacity.value = withTiming(0, { duration: 600 });
    }

    if (props.onPressIn) props.onPressIn(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    pressHandlers.onPressOut();
    if (props.onPressOut) props.onPressOut(e);
  };

  // Specular shine displacement
  const shineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shineProgress.value,
      [-1.5, 1.5],
      [-btnWidth * 1.5, btnWidth * 1.5]
    );
    return {
      transform: [{ translateX }, { skewX: '-25deg' }],
    };
  });

  // Specular ripple shader helper
  const skiaColor = variant === 'primary' ? 'rgba(255, 255, 255, 0.4)' : theme.accentColor;

  // Set visual styles depending on variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.accentColor,
          textColor: '#FFFFFF',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          intensity: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          textColor: theme.textColor,
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          intensity: 20,
        };
      case 'glass':
      default:
        return {
          backgroundColor: 'transparent',
          textColor: theme.textColor,
          borderColor: theme.glassBorder,
          intensity: 45,
        };
    }
  };

  const variantProps = getVariantStyles();

  return (
    <AnimatedPressable
      onLayout={handleLayout}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.buttonWrapper,
        scaleOnPress && pressStyle,
        glow && glassStyles.glows.accent(theme.accentGlow),
        style as ViewStyle,
      ]}
      {...props}
    >
      <LiquidView
        intensity={variantProps.intensity}
        borderRadius={16}
        glowColor={glow ? theme.accentGlow : undefined}
        style={[
          styles.liquidView,
          {
            backgroundColor: variantProps.backgroundColor,
            borderColor: variantProps.borderColor,
            borderWidth: variant === 'glass' ? 0 : 1,
            borderRadius: 16,
          },
        ]}
      >
        {/* Dynamic Skia Liquid Ripple Canvas */}
        {liquidRipple && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Canvas style={layoutStyles.absoluteFill}>
              {/* Blur + Contrast ColorMatrix = Organic Liquid Blend */}
              <Circle cx={touchX} cy={touchY} r={rippleRadius} color={skiaColor} opacity={rippleOpacity}>
                <Blur blur={15} />
                <ColorMatrix matrix={LIQUID_FUSION_COLOR_MATRIX} />
              </Circle>
            </Canvas>
          </View>
        )}

        {/* Specular Diagonal Reflection Layer */}
        {shineOnPress && (
          <Animated.View
            style={[
              layoutStyles.absoluteFill,
              layoutStyles.overflowHidden,
              { borderRadius: 16 },
              shineStyle,
            ]}
            pointerEvents="none"
          >
            <Svg height="100%" width="120%">
              <Defs>
                <LinearGradient id="btnShine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.0} />
                  <Stop offset="40%" stopColor="#ffffff" stopOpacity={0.0} />
                  <Stop offset="50%" stopColor="#ffffff" stopOpacity={variant === 'primary' ? 0.35 : 0.28} />
                  <Stop offset="60%" stopColor="#ffffff" stopOpacity={0.0} />
                  <Stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#btnShine)" />
            </Svg>
          </Animated.View>
        )}

        {/* Contents Center Wrapper */}
        <View style={[layoutStyles.center, styles.innerContainer]}>
          {children ? (
            children
          ) : (
            <Text
              style={[
                styles.titleText,
                { color: variantProps.textColor },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </View>
      </LiquidView>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  liquidView: {
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: '100%',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
