import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutChangeEvent } from 'react-native';
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
import * as Icons from 'lucide-react-native';

export interface TabRoute {
  key: string;
  title: string;
  icon: keyof typeof Icons; // Dynamic Lucide icons resolution!
}

export interface LiquidTabBarProps {
  routes: TabRoute[];
  activeIndex: number;
  onChange: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const APPLE_SPRING_STRETCH = {
  damping: 15,
  stiffness: 120,
  mass: 0.7,
};

const APPLE_SPRING_SNAP = {
  damping: 18,
  stiffness: 140,
  mass: 0.9,
};

export const LiquidTabBar: React.FC<LiquidTabBarProps> = ({
  routes,
  activeIndex,
  onChange,
  activeColor,
  inactiveColor,
}) => {
  const { theme, isDark } = useTheme();
  
  // Track tab sizes for precise positioning
  const [tabLayouts, setTabLayouts] = useState<Array<{ x: number; width: number }>>([]);
  const [barWidth, setBarWidth] = useState(0);

  // Left and Right bounds of the liquid indicator
  const indicatorLeft = useSharedValue(0);
  const indicatorRight = useSharedValue(0);
  const activeTabWidth = useSharedValue(80);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value && tabLayouts.length === routes.length && tabLayouts[activeIndex]) {
      const activeLayout = tabLayouts[activeIndex];
      activeTabWidth.value = activeLayout.width;
      const targetLeft = activeLayout.x;
      const targetRight = activeLayout.x + activeLayout.width;

      const currentLeft = indicatorLeft.value;
      const currentRight = indicatorRight.value;

      // Determine movement direction to apply organic asymmetry
      const isMovingRight = targetLeft > currentLeft;

      if (isMovingRight) {
        // Stretching right: Right edge springs out fast, Left edge catches up
        indicatorRight.value = withSpring(targetRight, APPLE_SPRING_STRETCH);
        indicatorLeft.value = withSpring(targetLeft, APPLE_SPRING_SNAP);
      } else {
        // Stretching left: Left edge springs out fast, Right edge catches up
        indicatorLeft.value = withSpring(targetLeft, APPLE_SPRING_STRETCH);
        indicatorRight.value = withSpring(targetRight, APPLE_SPRING_SNAP);
      }
    }
  }, [activeIndex, tabLayouts, routes.length]);

  const handleBarLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  const handleTabLayout = (index: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const updated = [...prev];
      updated[index] = { x, width };
      return updated;
    });
  };

  // Interactive drag-and-drop gesture across the tab bar
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const curX = e.x;
      const pillHalfWidth = (activeTabWidth.value || 60) / 2;
      const stretch = Math.min(22, Math.abs(e.velocityX) * 0.015);
      indicatorLeft.value = curX - pillHalfWidth - (e.velocityX > 0 ? 0 : stretch);
      indicatorRight.value = curX + pillHalfWidth + (e.velocityX > 0 ? stretch : 0);
    })
    .onEnd((e) => {
      isDragging.value = false;
      const endX = e.x;
      const count = routes.length;
      if (barWidth > 0 && count > 0) {
        const tabSlotWidth = barWidth / count;
        const nearestIndex = Math.max(0, Math.min(count - 1, Math.floor(endX / tabSlotWidth)));
        runOnJS(onChange)(nearestIndex);
      }
    });

  // Liquid Bubble indicator styling
  const indicatorStyle = useAnimatedStyle(() => {
    const width = Math.max(0, indicatorRight.value - indicatorLeft.value);
    return {
      left: indicatorLeft.value,
      width: width,
      // Apply subtle dynamic vertical squash relative to stretching speed/distance
      transform: [
        {
          scaleY: interpolateWidthToScaleY(width),
        },
      ],
    };
  });

  // Calculate dynamic vertical squish factor via SharedValue (no stale React state in worklet)
  const interpolateWidthToScaleY = (w: number) => {
    'worklet';
    const baseWidth = activeTabWidth.value;
    if (baseWidth <= 0) return 1;
    const stretchRatio = w / baseWidth;
    // Stretch thins the vertical blob slightly (simulate surface tension)
    return Math.max(0.85, Math.min(1.1, 1 - (stretchRatio - 1) * 0.22));
  };

  const activeTextColor = activeColor || theme.accentColor;
  const inactiveTextColor = inactiveColor || theme.subtextColor;

  return (
    <View style={styles.outerContainer}>
      <LiquidView
        intensity={60}
        borderRadius={30}
        style={styles.floatingBar}
        onLayout={handleBarLayout}
      >
        <GestureDetector gesture={panGesture}>
          <View style={layoutStyles.row}>
            {/* Asymmetric Liquid Stretching Indicator Bubble */}
            {tabLayouts.length === routes.length && (
              <Animated.View
                style={[
                  styles.liquidBlob,
                  {
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.75)',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.95)',
                  },
                  indicatorStyle,
                ]}
              />
            )}

            {/* Render Tabs */}
          {routes.map((route, index) => {
            const isActive = index === activeIndex;
            // Dynamically resolve Icon component from Lucide name
            const IconComponent = (Icons[route.icon] || Icons.HelpCircle) as any;
            
            return (
              <Pressable
                key={route.key}
                onLayout={(e) => handleTabLayout(index, e)}
                onPress={() => onChange(index)}
                style={styles.tabItem}
              >
                <View style={layoutStyles.center}>
                  <IconComponent
                    size={22}
                    color={isActive ? activeTextColor : inactiveTextColor}
                    strokeWidth={isActive ? 2.5 : 2.0}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isActive ? activeTextColor : inactiveTextColor },
                      isActive && styles.activeLabel,
                    ]}
                  >
                    {route.title}
                  </Text>
                </View>
              </Pressable>
            );
          })}
          </View>
        </GestureDetector>
      </LiquidView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  floatingBar: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 450,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  activeLabel: {
    fontWeight: '700',
  },
  liquidBlob: {
    position: 'absolute',
    height: '90%',
    top: '5%',
    borderRadius: 22,
    zIndex: 1,
    borderWidth: 1,
  },
});
