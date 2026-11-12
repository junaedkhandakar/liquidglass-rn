import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { glassStyles, layoutStyles } from '../utils/glassStyles';
import { APPLE_SPRING_CONFIG } from '../hooks/useLiquidAnimation';

export interface LiquidSheetProps {
  isOpen: boolean;
  onClose: () => void;
  height?: number; // Custom sheet height
  borderRadius?: number;
  intensity?: number;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LiquidSheet: React.FC<LiquidSheetProps> = ({
  isOpen,
  onClose,
  height = SCREEN_HEIGHT * 0.65, // Defaults to 65% of screen height
  borderRadius = 32,
  intensity = 65,
  children,
}) => {
  const { theme, isDark } = useTheme();
  const [renderSheet, setRenderSheet] = useState(isOpen);

  // Position metric: closed is sheet height, open is 0
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      setRenderSheet(true);
      translateY.value = withSpring(0, APPLE_SPRING_CONFIG);
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(height, APPLE_SPRING_CONFIG);
      backdropOpacity.value = withTiming(0, { duration: 250 });
      
      const timer = setTimeout(() => {
        setRenderSheet(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, height]);

  const handleClose = () => {
    translateY.value = withSpring(height, APPLE_SPRING_CONFIG);
    backdropOpacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  // Modern Gesture API configuration
  const context = useSharedValue({ y: 0 });
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const targetY = context.value.y + event.translationY;
      if (targetY < 0) {
        translateY.value = targetY * 0.2; // Elastic resistance above top point
      } else {
        translateY.value = targetY;
      }
    })
    .onEnd((event) => {
      const shouldClose = event.translationY > 120 || event.velocityY > 600;
      
      if (shouldClose) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0, APPLE_SPRING_CONFIG);
      }
    });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!renderSheet) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      
      {/* Backdrop fading overlay */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Drag gesture area + Glass Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheetContainer,
            { height, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius },
            sheetStyle,
          ]}
        >
          <LiquidView
            intensity={intensity}
            borderRadius={borderRadius}
            tint={isDark ? 'dark' : 'light'}
            style={styles.sheetGlass}
          >
            {/* Grab Bar Handle */}
            <View style={layoutStyles.center}>
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)' },
                ]}
              />
            </View>

            {/* Inner Content scrollable or fixed */}
            <View style={styles.content}>{children}</View>
          </LiquidView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 90,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  sheetGlass: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
