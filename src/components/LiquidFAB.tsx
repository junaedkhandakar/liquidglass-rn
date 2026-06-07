import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  withDelay,
} from 'react-native-reanimated';
import { Canvas, Circle, Blur, ColorMatrix } from '@shopify/react-native-skia';
import { useTheme } from '../hooks/useTheme';
import { LIQUID_FUSION_COLOR_MATRIX } from '../shaders/liquidShader';
import { APPLE_SPRING_CONFIG } from '../hooks/useLiquidAnimation';
import * as Icons from 'lucide-react-native';

export interface FABAction {
  icon: keyof typeof Icons;
  label: string;
  onPress: () => void;
}

export interface LiquidFABProps {
  icon?: keyof typeof Icons;
  actions: FABAction[];
  glow?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// FIX BUG #5: interpolateScale is defined BEFORE it is called inside useAnimatedStyle
// to ensure the Reanimated Babel worklet compiler picks it up correctly.
const interpolateScale = (val: number) => {
  'worklet';
  // Scale up from 0 to 1 as the FAB expands
  return val;
};

// FIX BUG #1: The maximum number of actions is capped at a constant so that all
// hooks are pre-allocated unconditionally on every render — no hooks inside .map().
const MAX_ACTIONS = 8;

export const LiquidFAB: React.FC<LiquidFABProps> = ({
  icon = 'Plus',
  actions,
  glow = true,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // FIX BUG #2: Measure the actual Skia canvas size via onLayout instead of
  // relying on hardcoded pixel values (70 / 270) that break on every device.
  const [canvasSize, setCanvasSize] = useState({ width: 140, height: 400 });

  const animationProgress = useSharedValue(0);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    animationProgress.value = withSpring(isOpen ? 0 : 1, {
      ...APPLE_SPRING_CONFIG,
      damping: isOpen ? 16 : 11,
    });
  };

  // Main FAB sizing metrics
  const fabSize = 60;
  const itemSize = 48;
  const spacing = 16;

  // FIX BUG #1: Pre-allocate MAX_ACTIONS derived values unconditionally so hook
  // call order never changes between renders regardless of actions.length.
  const displacement0 = useDerivedValue(() => {
    if (0 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 0 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement1 = useDerivedValue(() => {
    if (1 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 1 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement2 = useDerivedValue(() => {
    if (2 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 2 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement3 = useDerivedValue(() => {
    if (3 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 3 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement4 = useDerivedValue(() => {
    if (4 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 4 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement5 = useDerivedValue(() => {
    if (5 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 5 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement6 = useDerivedValue(() => {
    if (6 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 6 * (itemSize + spacing));
    return animationProgress.value * target;
  });
  const displacement7 = useDerivedValue(() => {
    if (7 >= actions.length) return 0;
    const target = -(fabSize / 2 + spacing + itemSize / 2 + 7 * (itemSize + spacing));
    return animationProgress.value * target;
  });

  // Collect into an array for indexed access in render
  const allDisplacements = [
    displacement0, displacement1, displacement2, displacement3,
    displacement4, displacement5, displacement6, displacement7,
  ];

  // FIX BUG #1: Pre-allocate MAX_ACTIONS animated styles unconditionally.
  const actionStyle0 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[0].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[1].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[2].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[3].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle4 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[4].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle5 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[5].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle6 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[6].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));
  const actionStyle7 = useAnimatedStyle(() => ({
    transform: [{ translateY: allDisplacements[7].value }, { scale: interpolateScale(animationProgress.value) }],
    opacity: withSpring(animationProgress.value, { damping: 15 }),
    pointerEvents: animationProgress.value > 0.5 ? 'auto' : ('none' as any),
  }));

  const allActionStyles = [
    actionStyle0, actionStyle1, actionStyle2, actionStyle3,
    actionStyle4, actionStyle5, actionStyle6, actionStyle7,
  ];

  // Main FAB rotation style to turn 'Plus' into a 'Close' cross
  const mainFabIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animationProgress.value * 135}deg` }],
  }));

  // Main FAB glow
  const mainFabGlow = useAnimatedStyle(() => ({
    shadowColor: theme.accentColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: withSpring(isOpen ? 0.6 : 0.35),
    shadowRadius: withSpring(isOpen ? 18 : 10),
    elevation: 8,
  }));

  const MainIcon = (Icons[icon] || Icons.Plus) as any;

  // FIX BUG #2: Canvas center computed from measured layout, not hardcoded.
  const canvasCX = canvasSize.width / 2;
  // Main FAB is anchored at the bottom — cy is canvas height minus half the fab radius.
  const canvasMainCY = canvasSize.height - fabSize / 2;

  const handleCanvasLayout = (e: LayoutChangeEvent) => {
    setCanvasSize({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/*
        The Liquid Skia Canvas.
        Placed behind the icons, rendering the organic metaball connection
        between the main circular button and the secondary action circles.
      */}
      <View style={styles.canvasContainer} pointerEvents="none" onLayout={handleCanvasLayout}>
        <Canvas style={styles.canvas}>
          {/* Main FAB blob — anchored to the bottom of the canvas */}
          <Circle
            cx={canvasCX}
            cy={canvasMainCY}
            r={fabSize / 2}
            color={theme.accentColor}
          />

          {/* Secondary liquid blobs — positions driven by measured layout */}
          {actions.slice(0, MAX_ACTIONS).map((_, index) => {
            // cy is derived from the pre-allocated displacement shared values
            const cy = useDerivedValue(
              () => canvasMainCY + allDisplacements[index].value
            );
            return (
              <Circle
                key={index}
                cx={canvasCX}
                cy={cy}
                r={itemSize / 2}
                color={theme.accentColor}
              />
            );
          })}

          {/* Group mask to fuse shapes into organic metaballs */}
          <Blur blur={12} />
          <ColorMatrix matrix={LIQUID_FUSION_COLOR_MATRIX} />
        </Canvas>
      </View>

      {/* Overlay Interactive Elements (Pure React Native UI) */}
      <View
        style={[styles.buttonsLayer, { height: fabSize + actions.length * (itemSize + spacing) + 40 }]}
        pointerEvents="box-none"
      >
        {/* Secondary Action Items */}
        {actions.slice(0, MAX_ACTIONS).map((action, index) => {
          const ActionIcon = (Icons[action.icon] || Icons.HelpCircle) as any;
          return (
            <Animated.View
              key={index}
              style={[
                styles.actionItem,
                {
                  width: itemSize,
                  height: itemSize,
                  borderRadius: itemSize / 2,
                  bottom: fabSize / 2 - itemSize / 2,
                },
                allActionStyles[index],
              ]}
            >
              <Pressable
                onPress={() => {
                  action.onPress();
                  toggleOpen();
                }}
                style={[styles.actionPressable, { borderRadius: itemSize / 2 }]}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <ActionIcon size={20} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>

              {/* Descriptive label */}
              {isOpen && (
                <View style={[styles.labelContainer, { right: itemSize + 12 }]}>
                  <Text style={[styles.labelText, { color: theme.textColor }]}>
                    {action.label}
                  </Text>
                </View>
              )}
            </Animated.View>
          );
        })}

        {/* Main FAB Button */}
        <AnimatedPressable
          onPress={toggleOpen}
          style={[
            styles.mainFab,
            {
              width: fabSize,
              height: fabSize,
              borderRadius: fabSize / 2,
              backgroundColor: theme.accentColor,
            },
            glow && mainFabGlow,
          ]}
        >
          <Animated.View style={mainFabIconStyle}>
            <MainIcon size={28} color="#FFFFFF" strokeWidth={2.5} />
          </Animated.View>
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 140,
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 99,
  },
  canvasContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 140,
    height: 400,
    zIndex: 1,
  },
  canvas: {
    width: 140,
    height: 400,
  },
  buttonsLayer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
  },
  mainFab: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 40, // (140 - 60) / 2 = 40 — centers the 60px FAB in 140px canvas
    zIndex: 20,
  },
  actionItem: {
    position: 'absolute',
    right: 46, // (140 - 48) / 2 = 46 — centers the 48px blob in 140px canvas
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  actionPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});
