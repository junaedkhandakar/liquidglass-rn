import React, { useState } from 'react';
import { StyleSheet, View, ViewProps, LayoutChangeEvent, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Canvas,
  BackdropFilter,
  Blur,
  Skia,
  Fill,
  Shader,
} from '@shopify/react-native-skia';
import { useTheme } from '../hooks/useTheme';
import { glassStyles, layoutStyles } from '../utils/glassStyles';
import { REFRACTION_SHADER } from '../shaders/refractionShader';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  useFrameCallback,
  SharedValue,
} from 'react-native-reanimated';

export interface LiquidViewProps extends ViewProps {
  intensity?: number | SharedValue<number>; // Supports static numbers or Reanimated SharedValues
  tint?: 'light' | 'dark' | 'none';
  experimentalSkia?: boolean;  // Render with Skia custom refraction shader
  borderGlow?: boolean;         // Enable continuous light-catching border highlights
  glowColor?: string;           // Custom color for border glow/rim
  borderRadius?: number;
  children?: React.ReactNode;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Build the Skia RuntimeEffect safely (guarding against environments without Skia native bindings)
const refractionEffect = (() => {
  try {
    if (typeof Skia !== 'undefined' && Skia?.RuntimeEffect?.Make) {
      return Skia.RuntimeEffect.Make(REFRACTION_SHADER);
    }
  } catch (e) {
    // Graceful fallback if Skia is unavailable
  }
  return null;
})();

export const LiquidView: React.FC<LiquidViewProps> = ({
  intensity = 50,
  tint,
  experimentalSkia = false,
  borderGlow = false,
  glowColor,
  borderRadius = 20,
  style,
  children,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dimensionsWidthSV = useSharedValue(0);
  const dimensionsHeightSV = useSharedValue(0);

  // Shader time uniform — updated on every UI-thread frame via useFrameCallback
  const time = useSharedValue(0);

  // Runs on the Reanimated UI thread — no JS bridge involvement
  useFrameCallback(
    (frameInfo) => {
      time.value = frameInfo.timestamp / 1000;
    },
    experimentalSkia && !!refractionEffect
  );

  // Worklet-safe intensity reader
  const getIntensityRaw = () => {
    'worklet';
    if (typeof intensity === 'number') return intensity;
    if (intensity && 'value' in intensity) return intensity.value;
    return 50;
  };

  // Two-pass Skia approach with UI-thread dimensions
  const skiaUniforms = useDerivedValue(() => {
    const rawInt = getIntensityRaw();
    const strength = (rawInt / 100) * 0.08;
    const w = dimensionsWidthSV.value || dimensions.width;
    const h = dimensionsHeightSV.value || dimensions.height;
    return {
      resolution: [w, h],
      uLightPos: [w / 2, -50],
      uTime: time.value,
      uDistortionStrength: strength,
      uSpecularIntensity: isDark ? 0.8 : 0.4,
    };
  }, [dimensions, isDark, intensity]);

  // Derived Skia blur radius
  const skiaBlurRadius = useDerivedValue(() => {
    return getIntensityRaw() * 0.3;
  }, [intensity]);

  // Animated props for native BlurView
  const animatedBlurProps = useAnimatedProps(() => {
    return {
      intensity: getIntensityRaw(),
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
    dimensionsWidthSV.value = width;
    dimensionsHeightSV.value = height;
    if (props.onLayout) props.onLayout(event);
  };

  // Determine active colors based on explicit tint prop or current theme
  const getTintProps = () => {
    const activeTint = tint || (isDark ? 'dark' : 'light');
    if (activeTint === 'light') {
      return {
        blurTint: 'light' as const,
        fillColor: 'rgba(255, 255, 255, 0.42)',
        borderColor: 'rgba(255, 255, 255, 0.65)',
      };
    } else if (activeTint === 'dark') {
      return {
        blurTint: 'dark' as const,
        fillColor: 'rgba(20, 20, 25, 0.55)',
        borderColor: 'rgba(255, 255, 255, 0.16)',
      };
    }
    return {
      blurTint: 'default' as const,
      fillColor: 'transparent',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    };
  };

  const tintProps = getTintProps();
  const activeGlowColor = glowColor || theme.glowColor;

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        { borderRadius, borderCurve: 'continuous' as any },
        borderGlow && glassStyles.glows.accent(activeGlowColor),
        style,
      ]}
      {...props}
    >
      {/* Background blur and overlay layers */}
      <View style={[layoutStyles.absoluteFill, layoutStyles.overflowHidden, { borderRadius, borderCurve: 'continuous' as any }]}>
        {experimentalSkia && dimensions.width > 0 && dimensions.height > 0 && refractionEffect ? (
          // FIX BUG #7: Two-pass Skia approach:
          // 1. BackdropFilter blurs the scene behind this canvas.
          // 2. A Fill with the RuntimeShader paints the refraction on top of the blur.
          //    The shader's `image` uniform is automatically bound by Skia to the
          //    backdrop snapshot (i.e., the blurred version of everything behind).
          <Canvas style={layoutStyles.absoluteFill}>
            {/* Pass 1: Apply backdrop blur */}
            <BackdropFilter filter={<Blur blur={skiaBlurRadius} />}>
              <Fill color="transparent" />
            </BackdropFilter>

            {/* Pass 2: Refraction distortion + specular highlights on a full-canvas Fill */}
            <Fill>
              <Shader source={refractionEffect} uniforms={skiaUniforms} />
            </Fill>
          </Canvas>
        ) : (
          // Fast native blurring pipeline with Android hardware blur support
          <AnimatedBlurView
            animatedProps={animatedBlurProps}
            tint={tintProps.blurTint}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={layoutStyles.absoluteFill}
          />
        )}

        {/* Soft glass background shading overlay */}
        <View
          style={[
            layoutStyles.absoluteFill,
            {
              backgroundColor: tintProps.fillColor,
              borderWidth: 1,
              borderColor: tintProps.borderColor,
              borderRadius,
              borderCurve: 'continuous' as any,
            },
          ]}
        />

        {/* Top-edge razor-sharp specular reflection bevel */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: borderRadius * 0.5,
            right: borderRadius * 0.5,
            height: 1,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.85)',
          }}
          pointerEvents="none"
        />
      </View>

      {/* Children content container */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
    borderWidth: 0, // Border is rendered inside the overlay view to prevent clipping
  },
  content: {
    backgroundColor: 'transparent',
  },
});
