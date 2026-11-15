import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LiquidView } from './LiquidView';
import { useTheme } from '../hooks/useTheme';
import { triggerHaptic } from '../utils/haptics';
import { useLiquidConfig } from '../hooks/useLiquidConfig';

export interface LiquidSearchBarProps extends Omit<TextInputProps, 'style'> {
  placeholder?: string;
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
  onClear?: () => void;
  onSubmit?: () => void;
  haptics?: boolean;
  intensity?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
  inputStyle?: any;
  showIcon?: boolean;
  clearable?: boolean;
}

/**
 * Apple iOS Search Bar rendered as a frosted liquid glass capsule.
 */
export const LiquidSearchBar: React.FC<LiquidSearchBarProps> = ({
  placeholder = 'Search',
  onFocus,
  onBlur,
  onClear,
  onSubmit,
  haptics = true,
  intensity = 55,
  height = 40,
  borderRadius = 12,
  style,
  inputStyle,
  showIcon = true,
  clearable = true,
  value,
  onChangeText,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const { reduceMotion } = useLiquidConfig();
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? '');

  const focusScale = useSharedValue(1);
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (haptics) triggerHaptic('selection');
    focusScale.value = reduceMotion ? 1 : withSpring(1.02, { damping: 16, stiffness: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusScale.value = reduceMotion ? 1 : withSpring(1, { damping: 16, stiffness: 200 });
    onBlur?.(e);
  };

  const handleClear = () => {
    handleChange('');
    onClear?.();
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }));

  const hasValue = displayValue.length > 0;

  return (
    <Animated.View style={[styles.outer, containerStyle, style]}>
      <LiquidView
        intensity={intensity}
        borderRadius={borderRadius}
        style={[
          styles.field,
          {
            height,
            borderRadius,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(118, 118, 128, 0.12)',
            borderColor: isFocused
              ? isDark
                ? 'rgba(255, 255, 255, 0.35)'
                : 'rgba(0, 122, 255, 0.55)'
              : isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <View style={styles.row}>
          {showIcon && (
            <View style={styles.iconSlot}>
              <GlassMagnifierIcon color={theme.subtextColor} />
            </View>
          )}

          <TextInput
            {...props}
            value={displayValue}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.subtextColor}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            style={[
              styles.input,
              { color: theme.textColor },
              inputStyle,
            ]}
            accessibilityRole="search"
            clearButtonMode="never"
          />

          {clearable && hasValue && (
            <Pressable
              onPress={handleClear}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clearButton}
            >
              <View
                style={[
                  styles.clearCircle,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(118,118,128,0.3)' },
                ]}
              >
                <Text style={styles.clearGlyph}>✕</Text>
              </View>
            </Pressable>
          )}
        </View>
      </LiquidView>
    </Animated.View>
  );
};

/** Minimal magnifier glyph drawn with Views to avoid an icon font dependency. */
const GlassMagnifierIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.magnifier}>
    <View style={[styles.magnifierLens, { borderColor: color }]} />
    <View style={[styles.magnifierHandle, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  field: {
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
  iconSlot: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    height: '100%',
  },
  clearButton: {
    marginLeft: 6,
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearGlyph: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  magnifier: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magnifierLens: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  magnifierHandle: {
    position: 'absolute',
    width: 1.5,
    height: 5,
    borderRadius: 1,
    bottom: 0,
    right: 1,
    transform: [{ rotate: '-45deg' }],
  },
});
