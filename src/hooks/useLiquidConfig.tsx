import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

export interface LiquidConfig {
  /** Master switch for all haptic feedback across the library. */
  haptics: boolean;
  /** When true, all non-essential animations resolve instantly (OS-level reduce motion). */
  reduceMotion: boolean;
  /** Default blur intensity applied when a component does not specify one. */
  defaultIntensity: number;
  /** Enables the experimental Skia AGSL refraction pipeline globally. */
  experimentalSkia: boolean;
  /** Corner radius used by default for glass surfaces. */
  defaultBorderRadius: number;
}

export interface LiquidConfigContextType extends LiquidConfig {
  setHaptics: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  setDefaultIntensity: (v: number) => void;
  setExperimentalSkia: (v: boolean) => void;
}

const DEFAULT_CONFIG: LiquidConfig = {
  haptics: true,
  reduceMotion: false,
  defaultIntensity: 50,
  experimentalSkia: false,
  defaultBorderRadius: 20,
};

const LiquidConfigContext = createContext<LiquidConfigContextType | undefined>(undefined);

/**
 * Global configuration provider for the whole liquid glass library.
 * Wrap your app once to control haptics, reduce motion, defaults and the Skia pipeline.
 */
export const LiquidConfigProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<LiquidConfig>;
}> = ({ children, config }) => {
  const [settings, setSettings] = useState<LiquidConfig>({
    ...DEFAULT_CONFIG,
    ...config,
  });

  // Respect the OS-level Reduce Motion setting by default.
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted && enabled) {
        setSettings((prev) => ({ ...prev, reduceMotion: true }));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<LiquidConfigContextType>(
    () => ({
      ...settings,
      setHaptics: (v) => setSettings((p) => ({ ...p, haptics: v })),
      setReduceMotion: (v) => setSettings((p) => ({ ...p, reduceMotion: v })),
      setDefaultIntensity: (v) => setSettings((p) => ({ ...p, defaultIntensity: v })),
      setExperimentalSkia: (v) => setSettings((p) => ({ ...p, experimentalSkia: v })),
    }),
    [settings]
  );

  return (
    <LiquidConfigContext.Provider value={value}>{children}</LiquidConfigContext.Provider>
  );
};

/**
 * Access the global liquid glass configuration.
 * Works with or without a provider (falls back to safe defaults).
 */
export const useLiquidConfig = (): LiquidConfigContextType => {
  const ctx = useContext(LiquidConfigContext);
  if (ctx) return ctx;
  return {
    ...DEFAULT_CONFIG,
    setHaptics: () => {},
    setReduceMotion: () => {},
    setDefaultIntensity: () => {},
    setExperimentalSkia: () => {},
  };
};
