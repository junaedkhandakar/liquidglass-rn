import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, View, Pressable, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LiquidCard } from './LiquidCard';
import { useTheme } from '../hooks/useTheme';
import { layoutStyles } from '../utils/glassStyles';
import { APPLE_SPRING_CONFIG } from '../hooks/useLiquidAnimation';

export interface LiquidModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  blurBackdrop?: boolean;
  experimentalSkia?: boolean;
  children: React.ReactNode;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const LiquidModal: React.FC<LiquidModalProps> = ({
  visible,
  onClose,
  blurBackdrop = true,
  experimentalSkia = false,
  children,
}) => {
  const { theme, isDark } = useTheme();
  
  // Controls visibility state in React to allow exit animations to complete
  const [showModal, setShowModal] = useState(visible);

  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, APPLE_SPRING_CONFIG);
    } else {
      backdropOpacity.value = withTiming(0, { duration: 250 });
      modalScale.value = withSpring(0.9, APPLE_SPRING_CONFIG);
      
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 250); // Matches timing duration to unmount cleanly
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // FIX BUG #10: Instead of a bare setTimeout (which can race with state changes),
  // we use runOnJS inside withTiming's completion callback so onClose() fires
  // only after the animation fully completes — no race conditions.
  const handleClose = () => {
    modalScale.value = withSpring(0.9, APPLE_SPRING_CONFIG);
    backdropOpacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
    };
  });

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={[layoutStyles.center, styles.overlay]}>
        
        {/* Full-screen Blurry Backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          {blurBackdrop ? (
            <BlurView
              intensity={45}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' },
              ]}
            />
          )}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Glass Card Container */}
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.modalCardWrapper, modalStyle]}>
            <LiquidCard
              intensity={70}
              shadowDepth="high"
              borderRadius={28}
              borderGlow={true}
              interactive={false} // Disable card tilt inside modal for touch accessibility
              experimentalSkia={experimentalSkia}
              style={styles.liquidCard}
            >
              {children}
            </LiquidCard>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 24,
  },
  modalCardWrapper: {
    width: '100%',
    maxWidth: width > 500 ? 460 : '96%',
    alignItems: 'center',
  },
  liquidCard: {
    width: '100%',
  },
});
