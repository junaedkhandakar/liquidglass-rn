import React from 'react';
import { StyleSheet, View, Text, StatusBar, SafeAreaView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { layoutStyles } from '../utils/glassStyles';

export interface LiquidNavbarProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  sticky?: boolean;
  scrollY?: SharedValue<number>;  // Dynamic scroll shared value
  maxScrollOffset?: number;      // Scroll threshold to reach full blur (default 80)
}

const AnimatedLiquidView = Animated.createAnimatedComponent(LiquidView);

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  title,
  leftComponent,
  rightComponent,
  sticky = true,
  scrollY,
  maxScrollOffset = 80,
}) => {
  const { theme, isDark } = useTheme();

  // Scroll link derived values
  const animatedIntensity = useDerivedValue(() => {
    if (!scrollY) return 70; // Static intensity if scroll position is not linked
    return interpolate(
      scrollY.value,
      [0, maxScrollOffset],
      [0, 75], // Smooth fade from transparent to highly frosted glass
      Extrapolate.CLAMP
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    
    // Smoothly fade border opacity and background blending
    const borderOpacity = interpolate(
      scrollY.value,
      [0, maxScrollOffset],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: interpolate(
        scrollY.value,
        [-20, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
      borderBottomWidth: 1,
      borderBottomColor: isDark 
        ? `rgba(255, 255, 255, ${borderOpacity * 0.15})`
        : `rgba(255, 255, 255, ${borderOpacity * 0.6})`,
    };
  });

  return (
    <Animated.View
      style={[
        styles.outerContainer,
        sticky && styles.stickyHeader,
        animatedStyle,
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea}>
        <AnimatedLiquidView
          intensity={animatedIntensity as any}
          tint={isDark ? 'dark' : 'light'}
          borderRadius={0}
          style={styles.innerView}
        >
          <View style={[layoutStyles.row, styles.content]}>
            {/* Left slot */}
            <View style={styles.sideSlot}>
              {leftComponent}
            </View>

            {/* Title slot */}
            <View style={styles.titleSlot}>
              <Text
                numberOfLines={1}
                style={[
                  styles.titleText,
                  { color: theme.textColor },
                ]}
              >
                {title}
              </Text>
            </View>

            {/* Right slot */}
            <View style={[styles.sideSlot, styles.rightAlign]}>
              {rightComponent}
            </View>
          </View>
        </AnimatedLiquidView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  safeArea: {
    width: '100%',
  },
  innerView: {
    width: '100%',
    borderWidth: 0, // Border is computed dynamically in animatedStyle
  },
  content: {
    height: 56,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  sideSlot: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  titleSlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
