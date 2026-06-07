# LiquidRN

High-Performance, Apple VisionOS-Inspired Liquid Glass UI Elements for React Native & Expo

## Installation

Expo SDK 54+ required. Skia GPU shaders require an Expo Development Client build (they do not work in Expo Go).

```bash
npx expo install liquidglass-rn @shopify/react-native-skia expo-blur react-native-reanimated react-native-gesture-handler react-native-svg lucide-react-native
```

## Quick Start

Always wrap your app root with `GestureHandlerRootView` and `LiquidThemeProvider`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LiquidThemeProvider, LiquidCard, LiquidButton } from 'liquidglass-rn';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LiquidThemeProvider defaultMode="system">
        <LiquidCard intensity={55} shadowDepth="medium">
          <LiquidButton variant="primary" title="Tap Me" glow />
        </LiquidCard>
      </LiquidThemeProvider>
    </GestureHandlerRootView>
  );
}
```

## Theme System

### LiquidThemeProvider

Wraps your app and provides theme tokens to all liquid components via React Context.

```tsx
<LiquidThemeProvider defaultMode="dark"> {/* 'light' | 'dark' | 'system' */}
  {children}
</LiquidThemeProvider>
```

### useTheme

```tsx
const { theme, isDark, toggleTheme, setThemeMode, themeMode } = useTheme();
```

## Components

### LiquidView

The foundational glass surface primitive. All other components are built on top of it.

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

Props:
- `intensity` (number | SharedValue<number>): Blur strength (0-100). Default: 50.
- `tint` ('light' | 'dark' | 'none'): Background tint flavor.
- `experimentalSkia` (boolean): Use Skia AGSL refraction shader instead of expo-blur. Default: false.
- `borderGlow` (boolean): Rim light glow effect. Default: false.
- `glowColor` (string): Custom RGBA color for the glow.
- `borderRadius` (number): Corner radius. Default: 20.

### LiquidCard

An interactive glass card with 3D parallax tilt, specular shine sweeps, and shadow depth.

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

Props (extends LiquidViewProps):
- `interactive` (boolean): Enables 3D tilt + press scale. Default: true.
- `shineSpeed` (number): Specular shine sweep interval in ms. Default: 4000.
- `shineOnTouch` (boolean): Trigger shine on tap. Default: true.
- `shadowDepth` ('low' | 'medium' | 'high'): Layered shadow preset. Default: 'medium'.

### LiquidButton

A tactile button with liquid ripple, specular shine, and spring press scale.

```tsx
<LiquidButton
  variant="primary"
  title="Tap Me"
  glow={false}
  liquidRipple={true}
  shineOnPress={true}
  scaleOnPress={true}
  onPress={() => {}}
/>
```

Props:
- `variant` ('primary' | 'secondary' | 'glass'): Visual style. Default: 'glass'.
- `liquidRipple` (boolean): Skia blur ripple from touch origin. Default: true.
- `shineOnPress` (boolean): SVG diagonal shine sweep on press. Default: true.
- `scaleOnPress` (boolean): Spring scale-down on press. Default: true.
- `glow` (boolean): Neon shadow glow. Default: false.
- `title` (string): Button label.
- `textStyle` (TextStyle): Custom text style.
- `children` (ReactNode): Custom content.

### LiquidNavbar

A scroll-linked translucent navigation bar that transitions to frosted glass on scroll.

```tsx
<LiquidNavbar
  title="My App"
  scrollY={scrollY}
  maxScrollOffset={80}
  leftComponent={<BackButton />}
  rightComponent={<MenuButton />}
/>
```

Props:
- `title` (string): Navbar title text. Required.
- `leftComponent` (ReactNode): Left slot.
- `rightComponent` (ReactNode): Right slot.
- `sticky` (boolean): Absolute positioned sticky header. Default: true.
- `scrollY` (SharedValue<number>): Reanimated scroll position.
- `maxScrollOffset` (number): Scroll distance to reach full blur. Default: 80.

### LiquidTabBar

A floating glass tab bar with an asymmetric liquid stretching indicator.

```tsx
<LiquidTabBar
  routes={routes}
  activeIndex={activeTab}
  onChange={setActiveTab}
/>
```

Props:
- `routes` (TabRoute[]): Array of tab definitions `{ key: string, title: string, icon: keyof typeof Icons }`. Required.
- `activeIndex` (number): Controlled active tab. Required.
- `onChange` ((index: number) => void): Tab change callback. Required.
- `activeColor` (string): Active icon/label color.
- `inactiveColor` (string): Inactive icon/label color.

### LiquidFAB

A floating action button that expands into a cluster of actions.

```tsx
<LiquidFAB
  icon="Plus"
  actions={actions}
  glow={true}
/>
```

Props:
- `icon` (keyof typeof Icons): Main FAB icon. Default: 'Plus'.
- `actions` (FABAction[]): Array of expandable actions `{ icon, label, onPress }`. Required. (Max 8 actions).
- `glow` (boolean): Neon glow shadow. Default: true.

### LiquidModal

A spring-animated centered glass modal.

```tsx
<LiquidModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  blurBackdrop={true}
  experimentalSkia={false}
>
  {children}
</LiquidModal>
```

Props:
- `visible` (boolean): Show/hide modal. Required.
- `onClose` (() => void): Dismiss callback. Required.
- `blurBackdrop` (boolean): Blur screen behind modal. Default: true.
- `experimentalSkia` (boolean): Pass-through to inner LiquidCard. Default: false.
- `children` (ReactNode): Modal content. Required.

### LiquidSheet

A draggable bottom sheet with spring physics and elastic rubber-banding.

```tsx
<LiquidSheet
  isOpen={sheetOpen}
  onClose={() => setSheetOpen(false)}
  height={SCREEN_HEIGHT * 0.65}
>
  {children}
</LiquidSheet>
```

Props:
- `isOpen` (boolean): Controls sheet visibility. Required.
- `onClose` (() => void): Dismiss callback. Required.
- `height` (number): Sheet panel height in pixels. Default: 65% of screen.
- `children` (ReactNode): Sheet content. Required.

## Hooks

### usePressAnimation

Spring scale-down animation for press interactions.

```tsx
const { scale, pressStyle, pressHandlers } = usePressAnimation(0.94);
```

### useShineAnimation

Sweeping specular highlight animation.

```tsx
const { shineProgress, triggerManualShine } = useShineAnimation(3000, false);
```

### use3DTiltAnimation

VisionOS-style 3D parallax tilt based on touch location.

```tsx
const { tiltStyle, glowStyle, setDimensions, tiltHandlers } = use3DTiltAnimation(10, 10);
```

## Shaders

### LIQUID_FUSION_COLOR_MATRIX

A 20-value color matrix that thresholds a blurred group of Skia circles into sharp organic metaball shapes.

```tsx
import { LIQUID_FUSION_COLOR_MATRIX } from 'liquidrn';
```

### REFRACTION_SHADER

An AGSL runtime shader for Skia that simulates thick liquid glass refraction with wave distortion, lens pinch, specular highlight, and edge glow.
