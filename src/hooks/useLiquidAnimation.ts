import { useEffect, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { GestureResponderEvent } from 'react-native';

// Spring physics config mimicking Apple fluid dynamics
export const APPLE_SPRING_CONFIG = {
  damping: 18,
  mass: 0.8,
  stiffness: 150,
};

export const APPLE_BOUNCE_CONFIG = {
  damping: 12,
  mass: 0.5,
  stiffness: 220,
};

/**
 * Custom hook for tactile spring scale down and press gestures
 */
export const usePressAnimation = (scaleTo = 0.96) => {
  const scale = useSharedValue(1);
  const isPressed = useSharedValue(false);

  const pressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(scaleTo, APPLE_BOUNCE_CONFIG);
    isPressed.value = true;
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, APPLE_SPRING_CONFIG);
    isPressed.value = false;
  };

  return {
    scale,
    isPressed,
    pressStyle,
    pressHandlers: {
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
    },
  };
};

/**
 * Custom hook for sweeping specular shine highlight progress
 */
export const useShineAnimation = (speed = 3000, autostart = true) => {
  const shineProgress = useSharedValue(-1.5); // Start off-screen left

  useEffect(() => {
    if (autostart) {
      shineProgress.value = withRepeat(
        withTiming(1.5, {
          duration: speed,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        -1, // Loop infinitely
        false // Do not reverse
      );
    }
  }, [speed, autostart]);

  const triggerManualShine = (duration = 800) => {
    shineProgress.value = -1.5;
    shineProgress.value = withTiming(1.5, {
      duration,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
  };

  return {
    shineProgress,
    triggerManualShine,
  };
};

/**
 * Custom hook for 3D parallax tilt hover effects (Apple VisionOS-like).
 *
 * FIX BUG #8: Previously used hardcoded width=300/height=180 which caused
 * wrong tilt sensitivity on any card that wasn't exactly that size.
 * Now the hook stores real layout dimensions via setDimensions(), which the
 * consuming component should call from its onLayout handler.
 */
export const use3DTiltAnimation = (maxTiltX = 8, maxTiltY = 8) => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const glowX = useSharedValue(0);
  const glowY = useSharedValue(0);
  // Store measured dimensions as a shared value so the worklet can read them
  const elementWidth = useSharedValue(300);
  const elementHeight = useSharedValue(180);

  /**
   * Call this from the component's onLayout to provide accurate dimensions.
   *
   * ```tsx
   * const { setDimensions, tiltHandlers, tiltStyle } = use3DTiltAnimation();
   * <Animated.View onLayout={e => {
   *   setDimensions(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
   * }} />
   * ```
   */
  const setDimensions = useCallback((width: number, height: number) => {
    elementWidth.value = width;
    elementHeight.value = height;
  }, []);

  const tiltStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: glowX.value },
        { translateY: glowY.value },
      ],
    };
  });

  const handleTouchMove = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    // Use measured dimensions from elementWidth/elementHeight shared values, guarded against 0
    const halfW = (elementWidth.value || 300) / 2;
    const halfH = (elementHeight.value || 180) / 2;
    const xPct = (locationX - halfW) / halfW;
    const yPct = (locationY - halfH) / halfH;

    rotateY.value = withSpring(xPct * maxTiltY, APPLE_SPRING_CONFIG);
    rotateX.value = withSpring(-yPct * maxTiltX, APPLE_SPRING_CONFIG);
    glowX.value = withSpring(xPct * 40, APPLE_SPRING_CONFIG);
    glowY.value = withSpring(yPct * 40, APPLE_SPRING_CONFIG);
  };

  const handleTouchEnd = () => {
    rotateX.value = withSpring(0, APPLE_SPRING_CONFIG);
    rotateY.value = withSpring(0, APPLE_SPRING_CONFIG);
    glowX.value = withSpring(0, APPLE_SPRING_CONFIG);
    glowY.value = withSpring(0, APPLE_SPRING_CONFIG);
  };

  return {
    tiltStyle,
    glowStyle,
    setDimensions,
    tiltHandlers: {
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
};
