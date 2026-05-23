import React, { useState } from 'react';
import { StyleSheet, View, ViewProps, LayoutChangeEvent } from 'react-native';
import { BlurView } from 'expo-blur';
import { Canvas, BackdropFilter, RuntimeShader, Blur, Skia } from '@shopify/react-native-skia';
import { useTheme } from '../hooks/useTheme';
import { glassStyles, layoutStyles } from '../utils/glassStyles';
import { REFRACTION_SHADER } from '../shaders/refractionShader';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
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
const refractionEffect = Skia.RuntimeEffect.Make(REFRACTION_SHADER);

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

  // Uniform values for Skia Refraction Shader
  const time = useSharedValue(0);
  
  // Animation ticker for Skia shader ripples
  React.useEffect(() => {
    if (experimentalSkia) {
      let animationFrameId: number;
      const startTime = Date.now();
      
      const updateShaderTime = () => {
        time.value = (Date.now() - startTime) / 1000;
        animationFrameId = requestAnimationFrame(updateShaderTime);
      };
      
      updateShaderTime();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [experimentalSkia]);

  // Derived helper for worklet usage
  const getIntensityRaw = () => {
    'worklet';
    if (typeof intensity === 'number') return intensity;
    return intensity.value;
  };

  // Combine dimensions and uniforms
  const skiaUniforms = useDerivedValue(() => {
    const rawInt = getIntensityRaw();
    const strength = (rawInt / 100) * 0.08; // Limit distortion to safe aesthetic bounds
    return {
      resolution: [dimensions.width, dimensions.height],
      uLightPos: [dimensions.width / 2, -50], // Default top-centered virtual light source
      uTime: time.value,
      uDistortionStrength: strength,
      uSpecularIntensity: isDark ? 0.8 : 0.4,
    };
  }, [dimensions, isDark, intensity]);

  // Derived Skia Blur radius
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
        { borderRadius },
        borderGlow && glassStyles.glows.accent(activeGlowColor),
        style,
      ]}
      {...props}
    >
      {/* Background blur and overlay layers */}
      <View style={[layoutStyles.absoluteFill, layoutStyles.overflowHidden, { borderRadius }]}>
        {experimentalSkia && dimensions.width > 0 && dimensions.height > 0 && refractionEffect ? (
          // GPU-Accelerated refraction backdrop pipeline
          <Canvas style={layoutStyles.absoluteFill}>
            <BackdropFilter
              filter={
                <Blur blur={skiaBlurRadius} />
              }
            >
              <RuntimeShader
                source={refractionEffect}
                uniforms={skiaUniforms}
              />
            </BackdropFilter>
          </Canvas>
        ) : (
          // Fast native blurring pipeline (using useAnimatedProps for reactive blurs)
          <AnimatedBlurView
            animatedProps={animatedBlurProps}
            tint={tintProps.blurTint}
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
            },
          ]}
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

