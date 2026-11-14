/**
 * Safe Apple Haptic Feedback Engine
 * Gracefully integrates with expo-haptics when available, without crashing if not installed.
 */

let ExpoHaptics: any = null;
try {
  ExpoHaptics = require('expo-haptics');
} catch {
  // Graceful fallback if expo-haptics is not installed
}

export type HapticType = 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' | 'success' | 'warning';

export const triggerHaptic = (type: HapticType = 'selection') => {
  if (!ExpoHaptics) return;
  try {
    switch (type) {
      case 'selection':
        ExpoHaptics.selectionAsync();
        break;
      case 'impactLight':
        ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle?.Light || 'light');
        break;
      case 'impactMedium':
        ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle?.Medium || 'medium');
        break;
      case 'impactHeavy':
        ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle?.Heavy || 'heavy');
        break;
      case 'success':
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType?.Success || 'success');
        break;
      case 'warning':
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType?.Warning || 'warning');
        break;
    }
  } catch {
    // Suppress non-critical haptic errors
  }
};
