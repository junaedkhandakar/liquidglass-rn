# liquidglass-rn

Apple-style liquid glass UI components for React Native and Expo. Built with native blur, Skia GPU shaders, and Reanimated 3 physics.

[Live Demo & Interactive Simulator](https://junaedkhandakar.github.io/liquidglass-rn/)

[![npm version](https://img.shields.io/npm/v/liquidglass-rn.svg?style=flat-square)](https://www.npmjs.com/package/liquidglass-rn)
[![npm downloads](https://img.shields.io/npm/dm/liquidglass-rn.svg?style=flat-square)](https://www.npmjs.com/package/liquidglass-rn)
[![total downloads](https://img.shields.io/npm/dt/liquidglass-rn.svg?style=flat-square)](https://www.npmjs.com/package/liquidglass-rn)
[![license](https://img.shields.io/npm/l/liquidglass-rn.svg?style=flat-square)](./LICENSE)

---

## Platform Support

- iOS: Hardware-accelerated frosted glass via native UIVisualEffectView.
- Android: Hardware-accelerated blur via dimezisBlurView, edge-to-edge status bar insets, Android back button dismissal for sheets/modals, and tuned soft shadows.
- Both: Skia GPU AGSL runtime shaders with optical chromatic dispersion.

## Requirements

- Expo SDK 54+ or React Native 0.81+ (iOS & Android)
- React 19
- React Native Reanimated v3+
- Expo Dev Client (only if using `experimentalSkia={true}`)

## Installation

Install the package and required peer dependencies:

```bash
npx expo install liquidglass-rn @shopify/react-native-skia expo-blur react-native-reanimated react-native-gesture-handler react-native-svg lucide-react-native
```

Add the Reanimated plugin to your `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

## Quick Start

Wrap your application root with `GestureHandlerRootView` and `LiquidThemeProvider`:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LiquidThemeProvider, LiquidCard, LiquidButton, useTheme } from 'liquidglass-rn';

function Screen() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LiquidCard intensity={55} shadowDepth="medium" style={styles.card}>
        <Text style={[styles.title, { color: theme.textColor }]}>Glass Card</Text>
        <Text style={[styles.subtitle, { color: theme.subtextColor }]}>
          VisionOS material with tilt physics and specular shine.
        </Text>
        <LiquidButton
          variant="primary"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
          glow
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
        <Screen />
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
});
```

---

## Theme System

### LiquidThemeProvider

Wraps the app context and injects light and dark tokens.

```tsx
<LiquidThemeProvider defaultMode="system"> {/* 'light' | 'dark' | 'system' */}
  {children}
</LiquidThemeProvider>
```

### useTheme

```tsx
const { theme, isDark, toggleTheme, setThemeMode, themeMode } = useTheme();
```

---

## Components

### LiquidView

Base glass surface primitive. Supports static blur values and Reanimated `SharedValue<number>`.

```tsx
<LiquidView
  intensity={50}
  tint="light"
  borderRadius={20}
  borderGlow={false}
  experimentalSkia={false}
>
  {children}
</LiquidView>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `intensity` | `number \| SharedValue<number>` | `50` | Blur strength (0-100). |
| `tint` | `'light' \| 'dark' \| 'none'` | Theme | Background tint mode. |
| `borderRadius` | `number` | `20` | Corner radius. |
| `borderGlow` | `boolean` | `false` | Enables glowing border. |
| `glowColor` | `string` | Theme accent | Glow color. |
| `experimentalSkia` | `boolean` | `false` | Renders two-pass AGSL refraction shader. |

### LiquidCard

Card with 3D parallax tilt, specular shine sweep, and shadow presets.

```tsx
<LiquidCard
  intensity={55}
  interactive={true}
  shineSpeed={4000}
  shineOnTouch={true}
  shadowDepth="medium"
  borderRadius={24}
>
  {children}
</LiquidCard>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `interactive` | `boolean` | `true` | Enables touch tilt and press spring. |
| `shineSpeed` | `number` | `4000` | Specular sweep duration in ms (0 to disable). |
| `shineOnTouch` | `boolean` | `true` | Triggers specular sweep on tap. |
| `shadowDepth` | `'low' \| 'medium' \| 'high'` | `'medium'` | Layered shadow preset. |

### LiquidButton

Button with Skia circular liquid ripple, diagonal shine, and spring scale.

```tsx
<LiquidButton
  variant="primary"
  title="Press Me"
  liquidRipple={true}
  shineOnPress={true}
  scaleOnPress={true}
  glow={false}
  disabled={false}
  onPress={() => {}}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'glass'` | `'glass'` | Visual variant. |
| `liquidRipple` | `boolean` | `true` | Skia fluid ripple on tap coordinates. |
| `shineOnPress` | `boolean` | `true` | Specular sweep on press. |
| `scaleOnPress` | `boolean` | `true` | Spring scale-down on press. |
| `glow` | `boolean` | `false` | Accent color outer glow. |
| `disabled` | `boolean` | `false` | Disables interaction and dims opacity. |
| `title` | `string` | `undefined` | Button text label. |

### LiquidSlider

Apple Control Center capsule slider with gesture drag tracking and spring momentum.

```tsx
<LiquidSlider
  value={0.65}
  onValueChange={(val) => console.log(val)}
  label="Brightness"
  height={56}
  borderRadius={22}
  intensity={50}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `undefined` | Controlled value (0 to 1). |
| `defaultValue` | `number` | `0.5` | Default value (0 to 1). |
| `onValueChange` | `(value: number) => void` | `undefined` | Drag progress callback. |
| `haptics` | `boolean` | `true` | Haptic feedback on boundary ticks. |
| `label` | `string` | `undefined` | Slider label text. |
| `icon` | `ReactNode` | `undefined` | Left slot icon. |
| `height` | `number` | `56` | Capsule height in px. |
| `borderRadius` | `number` | `22` | Capsule corner radius. |

### LiquidTabBar

Floating glass tab bar with asymmetric stretching indicator bubble.

```tsx
<LiquidTabBar
  routes={[
    { key: 'home', title: 'Home', icon: 'Home' },
    { key: 'search', title: 'Search', icon: 'Search' },
    { key: 'profile', title: 'Profile', icon: 'User' },
  ]}
  activeIndex={tabIndex}
  onChange={setTabIndex}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `routes` | `TabRoute[]` | Required | Array of `{ key, title, icon }`. |
| `activeIndex` | `number` | Required | Active tab index. |
| `onChange` | `(index: number) => void` | Required | Tab select callback. |
| `activeColor` | `string` | Theme accent | Active tab color. |
| `inactiveColor` | `string` | Theme subtext | Inactive tab color. |

### LiquidNavbar

Scroll-linked header that fades from transparent to frosted glass based on scroll position.

```tsx
<LiquidNavbar
  title="Settings"
  scrollY={scrollY}
  maxScrollOffset={80}
  leftComponent={<BackButton />}
  rightComponent={<ActionItem />}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Required | Navbar title. |
| `scrollY` | `SharedValue<number>` | `undefined` | Reanimated scroll shared value. |
| `maxScrollOffset` | `number` | `80` | Distance in px to reach maximum blur. |
| `sticky` | `boolean` | `true` | Absolute positioning at top. |
| `leftComponent` | `ReactNode` | `undefined` | Left action slot. |
| `rightComponent` | `ReactNode` | `undefined` | Right action slot. |

### LiquidFAB

Floating action button with Skia metaball fusion separating actions on expand.

```tsx
<LiquidFAB
  icon="Plus"
  actions={[
    { icon: 'Image', label: 'Gallery', onPress: openGallery },
    { icon: 'Camera', label: 'Camera', onPress: openCamera },
  ]}
  glow={true}
/>
```

### LiquidModal

Centered glass modal with backdrop blur and spring scale transitions.

```tsx
<LiquidModal visible={visible} onClose={() => setVisible(false)}>
  {children}
</LiquidModal>
```

### LiquidSheet

Draggable bottom drawer with rubber-band resistance and velocity-based dismissal.

```tsx
<LiquidSheet isOpen={open} onClose={() => setOpen(false)} height={400}>
  {children}
</LiquidSheet>
```

---

## Animation Hooks & Shaders

### Hooks

```tsx
import { usePressAnimation, useShineAnimation, use3DTiltAnimation } from 'liquidglass-rn';

const { pressStyle, pressHandlers } = usePressAnimation(0.96);
const { shineProgress, triggerManualShine } = useShineAnimation(3000);
const { tiltStyle, setDimensions, tiltHandlers } = use3DTiltAnimation(10, 10);
```

### Shaders

```tsx
import { LIQUID_FUSION_COLOR_MATRIX, REFRACTION_SHADER } from 'liquidglass-rn';
```

- `LIQUID_FUSION_COLOR_MATRIX`: 20-value color matrix thresholding blurred shapes into sharp metaballs.
- `REFRACTION_SHADER`: AGSL runtime shader for Skia calculating wave distortion, lens center pinch, specular highlight, and rim lighting.

---

## Native Blur vs Skia Shader

| Feature | Native Mode (`default`) | Skia Mode (`experimentalSkia={true}`) |
| :--- | :--- | :--- |
| Engine | `expo-blur` | `@shopify/react-native-skia` AGSL |
| Expo Go | Yes | No (requires Dev Client / prebuild) |
| Refraction Warping | No (Gaussian blur only) | Yes (physical lens pinch and wave distortion) |
| Specular Reflection | Static CSS / SVG layer | Dynamic GPU lighting calculations |

---

## License

MIT © Junaed Khandakar
