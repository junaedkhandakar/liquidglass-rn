# liquidglass-rn

<div align="center">

![Liquid Glass UI](https://img.shields.io/badge/LiquidRN-VisionOS%20Glass-purple?style=for-the-badge&logo=apple)

**High-Performance, Apple OS-Inspired Liquid Glass UI Elements for React Native & Expo.**

Recreate Apple VisionOS and iOS-style translucent glassmorphic interfaces with real-time hardware blur, custom Skia AGSL refraction shaders, and fluid 60/120 FPS Reanimated 3 physics.

<p align="center">
  <a href="https://www.npmjs.com/package/liquidglass-rn">
    <img src="https://img.shields.io/npm/v/liquidglass-rn.svg?style=flat-square&color=e85d04" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/liquidglass-rn">
    <img src="https://img.shields.io/npm/dt/liquidglass-rn.svg?style=flat-square&color=6366f1" alt="npm total downloads" />
  </a>
  <a href="https://www.npmjs.com/package/liquidglass-rn">
    <img src="https://img.shields.io/npm/dm/liquidglass-rn.svg?style=flat-square&color=3b82f6" alt="npm monthly downloads" />
  </a>
  <a href="https://github.com/Junaed93/liquidglass-rn/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/Junaed93/liquidglass-rn/ci.yml?branch=main&style=flat-square&label=CI" alt="CI Status" />
  </a>
  <a href="https://expo.dev">
    <img src="https://img.shields.io/badge/Expo-SDK%2054+-000000.svg?style=flat-square&logo=expo" alt="Expo SDK 54+" />
  </a>
  <a href="https://reactnative.dev">
    <img src="https://img.shields.io/badge/React%20Native-0.81+-61DAFB.svg?style=flat-square&logo=react" alt="React Native 0.81+" />
  </a>
  <a href="https://github.com/Junaed93/liquidglass-rn/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/liquidglass-rn.svg?style=flat-square&color=10b981" alt="license" />
  </a>
  <a href="https://github.com/Junaed93/liquidglass-rn/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  </a>
</p>

</div>

---

## 📊 Live Package Stats

| Metric | Stat |
| :--- | :--- |
| **Total Downloads** | **590+ downloads** (verified via npm API registry) |
| **Live Total Badge** | [![Total Downloads](https://img.shields.io/npm/dt/liquidglass-rn.svg?style=flat-square&color=6366f1)](https://www.npmjs.com/package/liquidglass-rn) |
| **Monthly Trend** | [![Monthly Downloads](https://img.shields.io/npm/dm/liquidglass-rn.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/liquidglass-rn) |
| **Latest Release** | `1.0.4` |
| **Architecture** | Supports React Native New Architecture (Fabric & TurboModules) |

---

## ✨ Features

- 🍏 **VisionOS & iOS Aesthetics** — Authentic Apple-grade frosted glass, specular diagonal shine sweeps, layered soft shadows, and glowing rim lights.
- ⚡ **Dual Blurring Pipeline**:
  - **Native Mode (Default)** — Ultra-fast hardware-accelerated blurring via `expo-blur` (zero config, works everywhere).
  - **Experimental Skia Mode** — AGSL runtime refraction shader simulating physical glass dome lens pinch, dynamic ripple distortion, and ambient light glare.
- 🫧 **Organic Skia Metaballs** — Alpha channel color matrix thresholding (`LIQUID_FUSION_COLOR_MATRIX`) that organically stretches and blends separating elements in the FAB and button ripples.
- 🏎️ **100% UI-Thread Physics** — Reanimated 3 worklets, shared values, and frame callbacks for guaranteed 60/120 FPS interactions without JS bridge overhead.
- 🎨 **First-Class Theme Engine** — Built-in `LiquidThemeProvider` and `useTheme` supporting deep Obsidian dark mode, clean iOS light grey, and automatic system switching.
- 🧩 **Complete Component Suite** — 8 production-ready glass components out of the box.

---

## 📦 Installation

Expo SDK 54+ and React Native 0.81+ are recommended.

```bash
# 1. Install liquidglass-rn and its peer dependencies via Expo CLI:
npx expo install liquidglass-rn @shopify/react-native-skia expo-blur react-native-reanimated react-native-gesture-handler react-native-svg lucide-react-native

# Or using standard npm:
npm install liquidglass-rn
```

### Reanimated Babel Plugin

Ensure `react-native-reanimated/plugin` is added to your `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be listed last
    ],
  };
};
```

> **Note on Skia Shaders:** Standard blurring via `expo-blur` runs seamlessly in Expo Go. The custom AGSL GPU runtime refraction shader (`experimentalSkia={true}`) requires an **Expo Development Client** (`npx expo run:ios` or `npx expo run:android`).

---

## 🚀 Quick Start

Always wrap your root component with `GestureHandlerRootView` and `LiquidThemeProvider`:

```tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  LiquidThemeProvider,
  LiquidCard,
  LiquidButton,
  useTheme,
} from 'liquidglass-rn';

function Home() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LiquidCard
        intensity={60}
        shadowDepth="high"
        borderGlow={true}
        style={styles.card}
      >
        <Text style={[styles.title, { color: theme.textColor }]}>
          Liquid Glass
        </Text>
        <Text style={[styles.subtitle, { color: theme.subtextColor }]}>
          Apple VisionOS glass physics in React Native.
        </Text>

        <LiquidButton
          variant="primary"
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          glow={true}
          liquidRipple={true}
          onPress={toggleTheme}
        />
      </LiquidCard>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LiquidThemeProvider defaultMode="system">
        <Home />
      </LiquidThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
});
```

---

## 🎨 Theme System

### `LiquidThemeProvider`

Provides theme tokens to all components through React Context.

```tsx
<LiquidThemeProvider defaultMode="dark"> {/* 'light' | 'dark' | 'system' */}
  {children}
</LiquidThemeProvider>
```

### `useTheme` Hook

```tsx
const {
  theme,        // LiquidThemeColors token object
  isDark,       // boolean
  toggleTheme,  // () => void
  setThemeMode, // (mode: 'light' | 'dark' | 'system') => void
  themeMode,    // 'light' | 'dark' | 'system'
} = useTheme();
```

---

## 🧩 Components API Reference

### 1. `LiquidView`
The foundational glass surface primitive. All other components are built on top of it. Supports both static numbers and Reanimated `SharedValue<number>` for dynamic blur updates without React re-renders.

```tsx
<LiquidView
  intensity={50}
  tint="light"
  borderRadius={20}
  borderGlow={false}
  glowColor="rgba(0,122,255,0.3)"
  experimentalSkia={false}
>
  {children}
</LiquidView>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `intensity` | `number \| SharedValue<number>` | `50` | Blur strength (0-100). |
| `tint` | `'light' \| 'dark' \| 'none'` | Based on theme | Background tint flavor. |
| `borderRadius` | `number` | `20` | Corner radius in pixels. |
| `borderGlow` | `boolean` | `false` | Enable glowing rim light. |
| `glowColor` | `string` | Theme accent | Custom RGBA/hex glow color. |
| `experimentalSkia` | `boolean` | `false` | Enable AGSL two-pass Skia shader. |

---

### 2. `LiquidCard`
An interactive tactile card with 3D parallax tilt, specular shine sweeps, and multi-tier shadow depths.

```tsx
<LiquidCard
  intensity={55}
  interactive={true}
  shineSpeed={4000}
  shineOnTouch={true}
  shadowDepth="medium"
  borderGlow={false}
  borderRadius={24}
>
  {children}
</LiquidCard>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `interactive` | `boolean` | `true` | Enables 3D perspective tilt and press bounce. |
| `shineSpeed` | `number` | `4000` | Specular shine sweep duration in ms (`0` disables). |
| `shineOnTouch` | `boolean` | `true` | Trigger specular sweep on tap. |
| `shadowDepth` | `'low' \| 'medium' \| 'high'` | `'medium'` | Layered soft shadow preset. |

---

### 3. `LiquidButton`
Tactile button with dynamic Skia liquid ripple originating from touch coordinates, specular press shine, and spring bounce scale.

```tsx
<LiquidButton
  variant="primary"
  title="Confirm Action"
  glow={true}
  liquidRipple={true}
  shineOnPress={true}
  scaleOnPress={true}
  disabled={false}
  onPress={() => {}}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'glass'` | `'glass'` | Visual button styling. |
| `liquidRipple` | `boolean` | `true` | Skia metaball liquid ripple from touch origin. |
| `shineOnPress` | `boolean` | `true` | Sweeping diagonal specular highlight on press. |
| `scaleOnPress` | `boolean` | `true` | Elastic spring scale-down on press. |
| `glow` | `boolean` | `false` | Neon backing glow. |
| `disabled` | `boolean` | `false` | Disabled state with opacity dimming. |
| `title` | `string` | `undefined` | Button text label. |

---

### 4. `LiquidTabBar`
Floating glass navigation tab bar with an asymmetric liquid stretching bubble that elongates toward target tabs and squishes vertically to simulate surface tension.

```tsx
<LiquidTabBar
  routes={[
    { key: 'home', title: 'Home', icon: 'Home' },
    { key: 'search', title: 'Search', icon: 'Search' },
    { key: 'settings', title: 'Settings', icon: 'Settings' },
  ]}
  activeIndex={currentTab}
  onChange={setCurrentTab}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `routes` | `TabRoute[]` | **Required** | Array of `{ key, title, icon: keyof LucideIcons }`. |
| `activeIndex` | `number` | **Required** | Currently selected tab index. |
| `onChange` | `(index: number) => void` | **Required** | Tab select callback. |
| `activeColor` | `string` | Theme accent | Active tab icon and label color. |
| `inactiveColor` | `string` | Theme subtext | Inactive tab icon and label color. |

---

### 5. `LiquidNavbar`
Scroll-linked translucent header bar that transitions dynamically from transparent to frosted glass based on scroll position.

```tsx
<LiquidNavbar
  title="Explore"
  scrollY={scrollY}
  maxScrollOffset={80}
  leftComponent={<BackButton />}
  rightComponent={<ShareButton />}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Required** | Header title string. |
| `scrollY` | `SharedValue<number>` | `undefined` | Reanimated scroll shared value. |
| `maxScrollOffset` | `number` | `80` | Scroll distance in px to reach maximum frosted blur. |
| `sticky` | `boolean` | `true` | Pins navbar to top using absolute positioning. |
| `leftComponent` | `ReactNode` | `undefined` | Left slot element. |
| `rightComponent` | `ReactNode` | `undefined` | Right slot element. |

---

### 6. `LiquidFAB`
Floating action button featuring Skia metaball fusion: actions organically stretch and detach from the main button upon expansion.

```tsx
<LiquidFAB
  icon="Plus"
  actions={[
    { icon: 'Camera', label: 'Photo', onPress: takePhoto },
    { icon: 'FileText', label: 'Document', onPress: openDoc },
  ]}
  glow={true}
/>
```

---

### 7. `LiquidModal` & `LiquidSheet`
- **`LiquidModal`**: Centered glass modal with backdrop blur, spring arrival, and coordinated dismiss exit animations.
- **`LiquidSheet`**: Draggable bottom drawer with elastic rubber-banding resistance and velocity-based gesture dismissal.

---

## 🪝 Animation Hooks & Shaders

### `usePressAnimation(scaleTo = 0.96)`
Returns `{ scale, isPressed, pressStyle, pressHandlers }` for spring tactile press feedback.

### `useShineAnimation(speed = 3000, autostart = true)`
Returns `{ shineProgress, triggerManualShine }` driving diagonal specular gleams.

### `use3DTiltAnimation(maxTiltX = 8, maxTiltY = 8)`
Returns `{ tiltStyle, glowStyle, setDimensions, tiltHandlers }` for VisionOS 3D parallax hover.

### `LIQUID_FUSION_COLOR_MATRIX`
A 20-value color matrix thresholding blurred shapes into razor-sharp organic metaball boundaries.

```tsx
import { LIQUID_FUSION_COLOR_MATRIX } from 'liquidglass-rn';
```

### `REFRACTION_SHADER`
AGSL Skia runtime shader simulating realistic thick liquid glass refraction with wave distortion, lens center pinch, specular highlight, and rim lighting.

---

## 🤖 CI/CD & Automated Publishing

This repository includes automated GitHub Actions workflows:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Runs on every push and pull request to `main`.
   - Validates TypeScript type safety across Node 20.x and 22.x.
2. **Automated npm Publishing (`.github/workflows/publish.yml`)**:
   - Triggers on GitHub Releases or version tags (`v*`).
   - Supports manual `workflow_dispatch` with dry-run mode.
   - Publishes to npm registry with npm provenance enabled.

To configure automated publishing:
1. Generate an Automation Access Token from [npmjs.com](https://www.npmjs.com).
2. Add it as a repository secret named `NPM_TOKEN` in **GitHub Repository Settings > Secrets and variables > Actions**.

---

## 📄 License

MIT © [LiquidRN Team](https://github.com/Junaed93/liquidglass-rn)
