import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';
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

export const LiquidFAB: React.FC<LiquidFABProps> = ({
  icon = 'Plus',
  actions,
  glow = true,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Reanimated shared values to animate secondary item displacement heights
  const animationProgress = useSharedValue(0);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    animationProgress.value = withSpring(isOpen ? 0 : 1, {
      ...APPLE_SPRING_CONFIG,
      damping: isOpen ? 16 : 11, // Bulges more on expansion, snaps faster on close
    });
  };

  // Main FAB sizing metrics
  const fabSize = 60;
  const itemSize = 48;
  const spacing = 16;

  // Deriving vertical coordinate offsets for the secondary circles
  // Item 0 is closest to FAB, Item 1 is above it, etc.
  const displacements = actions.map((_, index) => {
    return useDerivedValue(() => {
      const targetOffset = -(fabSize / 2 + spacing + itemSize / 2 + index * (itemSize + spacing));
      return animationProgress.value * targetOffset;
    });
  });

  // Main FAB rotation style to turn the 'Plus' into a beautiful 'Close' cross
  const mainFabIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${animationProgress.value * 135}deg`,
        },
      ],
    };
  });

  // Animated styles for the overlay buttons (containing the actual icons)
  const actionContainerStyles = actions.map((_, index) => {
    return useAnimatedStyle(() => {
      const yOffset = displacements[index].value;
      const opacity = withSpring(animationProgress.value, { damping: 15 });
      const scale = interpolateScale(animationProgress.value);
      
      return {
        transform: [
          { translateY: yOffset },
          { scale },
        ],
        opacity,
        pointerEvents: animationProgress.value > 0.5 ? 'auto' : 'none' as any,
      };
    });
  });

  const interpolateScale = (val: number) => {
    'worklet';
    // Scale up from 0 to 1 as it expands
    return val;
  };

  // Main FAB Background Glow
  const mainFabGlow = useAnimatedStyle(() => {
    return {
      shadowColor: theme.accentColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: withSpring(isOpen ? 0.6 : 0.35),
      shadowRadius: withSpring(isOpen ? 18 : 10),
      elevation: 8,
    };
  });

  const MainIcon = (Icons[icon] || Icons.Plus) as any;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* 
        The Liquid Skia Canvas.
        Placed behind the icons, rendering the organic metaball connection
        between the main circular button and the secondary action circles!
      */}
      <View style={styles.canvasContainer} pointerEvents="none">
        <Canvas style={styles.canvas}>
          <Circle
            cx={styles.canvas.width / 2 || 70}
            cy={styles.canvas.height / 2 || 270} // Centered on Main FAB
            r={fabSize / 2}
            color={theme.accentColor}
          />
          
          {/* Render the secondary liquid blobs morphing outwards */}
          {actions.map((_, index) => {
            const yOffset = displacements[index];
            const cx = 70; // Centered horizontal
            const cy = useDerivedValue(() => 270 + yOffset.value); // shift vertically
            
            return (
              <Circle
                key={index}
                cx={cx}
                cy={cy}
                r={itemSize / 2}
                color={theme.accentColor}
              />
            );
          })}

          {/* Group mask to fuse shapes */}
          <Blur blur={12} />
          <ColorMatrix matrix={LIQUID_FUSION_COLOR_MATRIX} />
        </Canvas>
      </View>

      {/* Overlay Interactive Elements (Pure React Native UI) */}
      <View style={[styles.buttonsLayer, { height: fabSize + actions.length * (itemSize + spacing) + 40 }]} pointerEvents="box-none">
        
        {/* Secondary Action Icons */}
        {actions.map((action, index) => {
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
                  bottom: fabSize / 2 - itemSize / 2, // Centered inside the main FAB initially
                },
                actionContainerStyles[index],
              ]}
            >
              <Pressable
                onPress={() => {
                  action.onPress();
                  toggleOpen();
                }}
                style={[
                  styles.actionPressable,
                  { borderRadius: itemSize / 2 },
                ]}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <ActionIcon size={20} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
              
              {/* Secondary item descriptive label overlay */}
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

        {/* The Main FAB Button */}
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
    width: 140, // Expanded space for labels
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
    right: 40, // Centered in the 140 width canvas (70px is center, minus half of 60px is 40px)
    zIndex: 20,
  },
  actionItem: {
    position: 'absolute',
    right: 46, // Centered in the 140 width canvas (70px is center, minus half of 48px is 46px)
    backgroundColor: 'transparent', // The background circle is drawn by Skia
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
