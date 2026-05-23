import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { LiquidThemeColors, lightTheme, darkTheme } from '../utils/theme';

interface ThemeContextType {
  theme: LiquidThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const LiquidThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultMode?: 'light' | 'dark' | 'system';
}> = ({ children, defaultMode = 'system' }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(defaultMode);
  
  const [activeTheme, setActiveTheme] = useState<LiquidThemeColors>(
    defaultMode === 'system'
      ? systemColorScheme === 'dark' ? darkTheme : lightTheme
      : defaultMode === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    if (themeMode === 'system') {
      setActiveTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    } else {
      setActiveTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }
  }, [themeMode, systemColorScheme]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        isDark: activeTheme.isDark,
        toggleTheme,
        setThemeMode,
        themeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if not wrapped in provider (to ensure library components can work stand-alone)
    return {
      theme: darkTheme, // default to premium dark mode
      isDark: true,
      toggleTheme: () => {},
      setThemeMode: () => {},
      themeMode: 'dark' as const,
    };
  }
  return context;
};
