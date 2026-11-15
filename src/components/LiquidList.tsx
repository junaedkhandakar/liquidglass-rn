import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  LayoutChangeEvent,
  SectionList,
  SectionListProps,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { layoutStyles } from '../utils/glassStyles';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidListHeaderProps {
  title?: string;
  subtitle?: string;
  scrollY?: SharedValue<number>;
  largeTitleHeight?: number;
}

/**
 * Apple large-title header that collapses into a compact inline title on scroll.
 */
export const LiquidListHeader: React.FC<LiquidListHeaderProps> = ({
  title = '',
  subtitle,
  scrollY,
  largeTitleHeight = 52,
}) => {
  const { theme, isDark } = useTheme();

  const compactStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 1 };
    const progress = interpolate(
      scrollY.value,
      [largeTitleHeight * 0.4, largeTitleHeight],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [-6, 0]) }],
    };
  });

  const largeStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 1 };
    const progress = interpolate(
      scrollY.value,
      [0, largeTitleHeight * 0.75],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [1, 0], [0, -12]) }],
    };
  });

  return (
    <View style={styles.headerWrap}>
      {scrollY && (
        <Animated.View style={[styles.compactBar, compactStyle]}>
          <Text
            numberOfLines={1}
            style={[styles.compactTitle, { color: theme.textColor }]}
          >
            {title}
          </Text>
        </Animated.View>
      )}

      <Animated.View style={largeStyle}>
        <Text style={[styles.largeTitle, { color: theme.textColor }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.largeSubtitle, { color: theme.subtextColor }]}>
            {subtitle}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
};

export interface LiquidSectionListProps<ItemT> extends SectionListProps<ItemT> {
  /** Scroll offset in px at which the large title collapses. */
  largeTitleHeight?: number;
  /** Hide the native section headers in favour of the Apple style. */
  hideSectionHeaders?: boolean;
}

/**
 * SectionList with an Apple style large title that collapses into an inline
 * frosted bar as the user scrolls.
 */
export function LiquidSectionList<ItemT>({
  largeTitleHeight = 52,
  hideSectionHeaders = false,
  renderSectionHeader,
  ...props
}: LiquidSectionListProps<ItemT>) {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <SectionList
      {...props}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={
        hideSectionHeaders
          ? undefined
          : renderSectionHeader
            ? (info) => renderSectionHeader(info as any)
            : undefined
      }
      ListHeaderComponent={
        <LiquidListHeader
          scrollY={scrollY}
          largeTitleHeight={largeTitleHeight}
          title={(props.ListHeaderComponent as any)?.props?.title ?? ''}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  compactBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
  largeSubtitle: {
    fontSize: 15,
    marginTop: 2,
  },
});
