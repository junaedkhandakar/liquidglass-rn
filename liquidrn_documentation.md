# liquidrn — Liquid Glass UI Library for React Native

> Apple-style liquid glass effects for Expo & React Native — VisionOS-inspired glassmorphism components powered by Reanimated 3 and React Native Skia.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [Theme System](#theme-system)
6. [Components](#components)
   - [LiquidView](#liquidview)
   - [LiquidCard](#liquidcard)
   - [LiquidButton](#liquidbutton)
   - [LiquidNavbar](#liquidnavbar)
   - [LiquidTabBar](#liquidtabbar)
   - [LiquidFAB](#liquidfab)
   - [LiquidModal](#liquidmodal)
   - [LiquidSheet](#liquidsheet)
7. [Hooks](#hooks)
8. [Shaders](#shaders)
9. [🐛 Bug Report & Fix Guide](#-bug-report--fix-guide)
10. [🍎 Apple Liquid Glass Fidelity Assessment](#-apple-liquid-glass-fidelity-assessment)
11. [Roadmap](#roadmap)

---

## Overview

**liquidrn** is an open-source React Native UI library that recreates Apple's Liquid Glass design language — first introduced in iOS 26 / VisionOS. It combines:

| Layer | Technology |
|---|---|
| Background blur (cross-platform) | `expo-blur` BlurView |
| GPU refraction shaders | `@shopify/react-native-skia` AGSL |
| Organic metaball blending | Skia `Blur + ColorMatrix` trick |
| Spring-physics animations | `react-native-reanimated` v3 |
| Gesture handling | `react-native-gesture-handler` v2 |
| Icons | `lucide-react-native` |

---

## Architecture Diagram

```
App
└── GestureHandlerRootView
    └── LiquidThemeProvider (ThemeContext)
        └── Dashboard
            ├── LiquidNavbar         ← Scroll-linked frosted header
            ├── Animated.ScrollView
            │   ├── LiquidCard       ← 3D tilt + specular shine card
            │   │   ├── LiquidView   ← Core glass surface (blur + overlay)
            │   │   └── SVG Shine Layer
            │   ├── LiquidButton     ← Skia ripple + spring tap
            │   └── LiquidTabBar     ← Asymmetric liquid indicator
            ├── LiquidModal          ← Centered spring modal
            ├── LiquidSheet          ← Gesture bottom drawer
            └── LiquidFAB            ← Skia metaball FAB cluster
```

---

## Installation

```bash
# Install the library
npx expo install liquidrn

# Required peer dependencies
npx expo install @shopify/react-native-skia expo-blur react-native-reanimated react-native-gesture-handler react-native-svg
```

> **Expo SDK 54+ required.** Skia GPU shaders require Expo Development Client (not Expo Go).

---

## Quick Start

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LiquidThemeProvider, LiquidCard, LiquidButton } from 'liquidrn';

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

> **Important:** Always wrap your app root with `GestureHandlerRootView` for `LiquidSheet` drag gestures to work.

---

## Theme System

### `LiquidThemeProvider`

Wraps your app and provides theme tokens to all liquid components via React Context.

```tsx
<LiquidThemeProvider defaultMode="dark"> {/* 'light' | 'dark' | 'system' */}
  {children}
</LiquidThemeProvider>
```

### `useTheme()`

```tsx
const { theme, isDark, toggleTheme, setThemeMode, themeMode } = useTheme();
```

| Field | Type | Description |
|---|---|---|
| `theme` | `LiquidThemeColors` | Active color tokens |
| `isDark` | `boolean` | Whether dark mode is active |
| `toggleTheme()` | `() => void` | Toggle dark/light |
| `setThemeMode(mode)` | `(mode) => void` | Set `'light'`, `'dark'`, or `'system'` |
| `themeMode` | `string` | Current mode string |

### Theme Token Reference

| Token | Light | Dark |
|---|---|---|
| `background` | `#EAEBF0` | `#0B0B0E` |
| `accentColor` | `#007AFF` (Apple Blue) | `#BF5AF2` (VisionOS Purple) |
| `glassFill` | `rgba(255,255,255,0.45)` | `rgba(20,20,25,0.55)` |
| `glassBorder` | `rgba(255,255,255,0.65)` | `rgba(255,255,255,0.15)` |
| `glowColor` | Subtle amethyst | Vibrant neon purple |
| `textColor` | `#1C1C1E` | `#F5F5F7` |
| `subtextColor` | `#8E8E93` | `#A1A1A6` |

---

## Components

---

### `LiquidView`

The **foundational glass surface** primitive. All other components are built on top of it.

```tsx
<LiquidView
  intensity={50}           // Blur strength: 0–100
  tint="light"             // 'light' | 'dark' | 'none'
  borderRadius={20}
  borderGlow={false}       // Enable border rim glow
  glowColor="rgba(0,122,255,0.3)"
  experimentalSkia={false} // Use GPU Skia refraction shader
>
  {children}
</LiquidView>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `intensity` | `number \| SharedValue<number>` | `50` | Blur strength (0–100). Supports live Reanimated values. |
| `tint` | `'light' \| 'dark' \| 'none'` | Auto from theme | Background tint flavor |
| `experimentalSkia` | `boolean` | `false` | Swap expo-blur for Skia AGSL refraction shader |
| `borderGlow` | `boolean` | `false` | Rim light glow effect |
| `glowColor` | `string` | Theme glow | Custom RGBA color for the glow |
| `borderRadius` | `number` | `20` | Corner radius |

**Rendering Modes:**

- **Native BlurView** (default, `experimentalSkia={false}`): Uses `expo-blur` which maps to `UIVisualEffectView` on iOS and `BlurDrawable` on Android. Best cross-platform compatibility.
- **Skia Refraction** (`experimentalSkia={true}`): Custom AGSL runtime shader that refracts the backdrop, adds dynamic wave distortion, specular highlights, and edge glow. Requires native build.

---

### `LiquidCard`

An interactive glass card with 3D parallax tilt, specular shine sweeps, and configurable shadow depth.

```tsx
<LiquidCard
  intensity={55}
  interactive={true}       // 3D tilt on touch/drag
  shineSpeed={4000}        // Auto-shine cycle in ms (0 to disable)
  shineOnTouch={true}      // Flash shine on tap
  shadowDepth="medium"     // 'low' | 'medium' | 'high'
  borderGlow={false}
  borderRadius={24}
  style={styles.card}
>
  {children}
</LiquidCard>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `interactive` | `boolean` | `true` | Enables 3D tilt + press scale |
| `shineSpeed` | `number` | `4000` | Specular shine sweep interval in ms |
| `shineOnTouch` | `boolean` | `true` | Trigger shine on tap |
| `shadowDepth` | `'low' \| 'medium' \| 'high'` | `'medium'` | Layered shadow preset |
| All `LiquidViewProps` | — | — | Passed through to the inner `LiquidView` |

> **Note:** `LiquidCard` extends `LiquidViewProps`, so all `LiquidView` props work here too.

---

### `LiquidButton`

A tactile button with liquid ripple, specular shine, spring press scale, and three visual variants.

```tsx
<LiquidButton
  variant="primary"        // 'primary' | 'secondary' | 'glass'
  title="Tap Me"
  glow={false}             // Pulsing accent neon glow
  liquidRipple={true}      // Skia organic liquid ripple on press
  shineOnPress={true}      // Specular highlight sweep on press
  scaleOnPress={true}      // Tactile spring scale down
  onPress={() => {}}
/>
```

**Variants:**

| Variant | Fill | Use Case |
|---|---|---|
| `primary` | Solid accent color | Primary CTA |
| `secondary` | Semi-transparent fill | Secondary action |
| `glass` | Fully transparent glass | Minimal/floating action |

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `string` | `'glass'` | Visual style |
| `liquidRipple` | `boolean` | `true` | Skia blur ripple from touch origin |
| `shineOnPress` | `boolean` | `true` | SVG diagonal shine sweep on press |
| `scaleOnPress` | `boolean` | `true` | Spring scale-down on press |
| `glow` | `boolean` | `false` | Neon shadow glow |
| `title` | `string` | — | Button label (used if no `children`) |
| `textStyle` | `TextStyle` | — | Custom text style |
| `children` | `ReactNode` | — | Custom content (overrides `title`) |

---

### `LiquidNavbar`

A scroll-linked translucent navigation bar that transitions from transparent to frosted glass as the user scrolls.

```tsx
const scrollY = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (e) => { scrollY.value = e.contentOffset.y; },
});

<LiquidNavbar
  title="My App"
  scrollY={scrollY}
  maxScrollOffset={80}
  leftComponent={<BackButton />}
  rightComponent={<MenuButton />}
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | required | Navbar title text |
| `leftComponent` | `ReactNode` | — | Left slot (back button, logo) |
| `rightComponent` | `ReactNode` | — | Right slot (actions, avatar) |
| `sticky` | `boolean` | `true` | Absolute positioned sticky header |
| `scrollY` | `SharedValue<number>` | — | Reanimated scroll position for dynamic blur |
| `maxScrollOffset` | `number` | `80` | Scroll distance to reach full blur |

---

### `LiquidTabBar`

A floating glass tab bar with an asymmetric liquid stretching indicator that simulates real surface tension.

```tsx
const [activeTab, setActiveTab] = useState(0);

const routes = [
  { key: 'home', title: 'Home', icon: 'Home' },   // Lucide icon names
  { key: 'search', title: 'Search', icon: 'Search' },
  { key: 'profile', title: 'Profile', icon: 'User' },
];

<LiquidTabBar
  routes={routes}
  activeIndex={activeTab}
  onChange={setActiveTab}
  activeColor="#007AFF"
  inactiveColor="#8E8E93"
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `routes` | `TabRoute[]` | required | Array of tab definitions |
| `activeIndex` | `number` | required | Controlled active tab |
| `onChange` | `(index) => void` | required | Tab change callback |
| `activeColor` | `string` | Theme accent | Icon/label color when active |
| `inactiveColor` | `string` | Theme subtext | Icon/label color when inactive |

**TabRoute shape:**
```ts
interface TabRoute {
  key: string;
  title: string;
  icon: keyof typeof Icons; // Any Lucide icon name
}
```

---

### `LiquidFAB`

A floating action button that expands into a cluster of organic Skia metaball bubbles.

```tsx
const actions = [
  { icon: 'Camera', label: 'Camera', onPress: openCamera },
  { icon: 'Image', label: 'Gallery', onPress: openGallery },
  { icon: 'Mic', label: 'Record', onPress: startRecording },
];

<LiquidFAB
  icon="Plus"    // Main button icon (Lucide name)
  actions={actions}
  glow={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `keyof typeof Icons` | `'Plus'` | Main FAB icon (Lucide name) |
| `actions` | `FABAction[]` | required | Array of expandable actions |
| `glow` | `boolean` | `true` | Neon glow shadow on main button |

**FABAction shape:**
```ts
interface FABAction {
  icon: keyof typeof Icons;
  label: string;
  onPress: () => void;
}
```

---

### `LiquidModal`

A spring-animated centered glass modal with optional blurry backdrop.

```tsx
<LiquidModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  blurBackdrop={true}
  experimentalSkia={false}
>
  <Text>Modal Content</Text>
  <LiquidButton title="Close" onPress={() => setModalVisible(false)} />
</LiquidModal>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | required | Show/hide the modal |
| `onClose` | `() => void` | required | Called when dismissed |
| `blurBackdrop` | `boolean` | `true` | Blur the screen behind the modal |
| `experimentalSkia` | `boolean` | `false` | Pass-through to inner `LiquidCard` |
| `children` | `ReactNode` | required | Modal content |

> **Tip:** The modal uses a delayed unmount so exit animations play before the modal is removed from the tree.

---

### `LiquidSheet`

A draggable bottom sheet with spring physics and elastic rubber-banding.

```tsx
<LiquidSheet
  isOpen={sheetOpen}
  onClose={() => setSheetOpen(false)}
  height={SCREEN_HEIGHT * 0.65}   // Custom height (default: 65%)
>
  <Text>Drawer Content</Text>
</LiquidSheet>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | required | Controls sheet visibility |
| `onClose` | `() => void` | required | Called when sheet is dismissed |
| `height` | `number` | `65% of screen` | Sheet panel height in pixels |
| `children` | `ReactNode` | required | Sheet content |

**Gesture behavior:**
- Drag down **> 120px** → closes with spring animation
- Drag down with velocity **> 600** → snaps closed
- Drag up beyond top → elastic rubber-band resistance (0.2× resistance factor)

---

## Hooks

### `usePressAnimation(scaleTo?)`

Spring scale-down animation for press interactions.

```tsx
const { scale, pressStyle, pressHandlers } = usePressAnimation(0.94);
// pressHandlers: { onPressIn, onPressOut }
```

### `useShineAnimation(speed?, autostart?)`

Sweeping specular highlight animation.

```tsx
const { shineProgress, triggerManualShine } = useShineAnimation(3000, false);
triggerManualShine(600); // Trigger a 600ms sweep manually
```

### `use3DTiltAnimation(maxTiltX?, maxTiltY?)`

VisionOS-style 3D parallax tilt based on touch location.

```tsx
const { tiltStyle, glowStyle, tiltHandlers } = use3DTiltAnimation(10, 10);
// tiltHandlers: { onTouchMove, onTouchEnd, onTouchCancel }
```

### Spring Config Constants

```tsx
import { APPLE_SPRING_CONFIG, APPLE_BOUNCE_CONFIG } from 'liquidrn';

// APPLE_SPRING_CONFIG: damping 18, mass 0.8, stiffness 150
// APPLE_BOUNCE_CONFIG: damping 12, mass 0.5, stiffness 220
```

---

## Shaders

### `LIQUID_FUSION_COLOR_MATRIX`

A 20-value color matrix that thresholds a blurred group of Skia circles into sharp organic metaball shapes. Apply via Skia `<ColorMatrix>` inside a blur group.

```tsx
import { LIQUID_FUSION_COLOR_MATRIX } from 'liquidrn';

<Canvas>
  <Circle cx={x} cy={y} r={radius} color="blue">
    <Blur blur={12} />
    <ColorMatrix matrix={LIQUID_FUSION_COLOR_MATRIX} />
  </Circle>
</Canvas>
```

The alpha row `[0, 0, 0, 24, -12]` multiplies the blurred alpha by 24 then subtracts 12 — clipping the soft blur into a razor-sharp liquid edge.

### `REFRACTION_SHADER` (AGSL)

An AGSL runtime shader for Skia that simulates thick liquid glass refraction:

- **Wave distortion**: sine/cosine UV displacement
- **Lens pinch**: barrel-distortion-style center refraction
- **Specular highlight**: Blinn-Phong-style hot spot from a virtual light source
- **Edge glow**: Ambient rim light at glass boundaries

**Uniforms:**

| Uniform | Type | Description |
|---|---|---|
| `image` | `shader` | The captured backdrop image |
| `resolution` | `vec2` | Canvas dimensions |
| `uLightPos` | `vec2` | Virtual light source position |
| `uTime` | `float` | Animated time for wave motion |
| `uDistortionStrength` | `float` | Wave amplitude (0.0–0.15) |
| `uSpecularIntensity` | `float` | Specular highlight strength |

---

## 🐛 Bug Report & Fix Guide

The following bugs were found through a full code audit of the `liquidrn` source.

---

### 🔴 BUG #1 — CRITICAL: Hooks called inside array `.map()` loops (Rules of Hooks violation)

**Files:** [`LiquidFAB.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidFAB.tsx#L56-L90)

**Severity:** 🔴 Critical — Will crash in production with React's strict mode and cause silent undefined behavior in other builds.

**Problem:**
```tsx
// ❌ ILLEGAL — Hooks inside .map() violates React Rules of Hooks
const displacements = actions.map((_, index) => {
  return useDerivedValue(() => { ... }); // ← Hook in loop!
});

const actionContainerStyles = actions.map((_, index) => {
  return useAnimatedStyle(() => { ... }); // ← Hook in loop!
});
```
React requires hooks to be called in the **same order on every render**. Calling them inside `.map()` means the count changes if `actions` changes, which breaks the hook call order guarantee.

Also on line 131:
```tsx
const cy = useDerivedValue(() => 270 + yOffset.value); // ← Hook inside JSX .map() callback!
```

**Fix:** Pre-create all shared values outside `.map()` using a fixed-length approach:

```tsx
// ✅ CORRECT — Pre-allocate shared values for a max number of actions outside the component render
// Or use a ref to store the derived values:

const MAX_ACTIONS = 10;

// Inside the component (before any conditionals):
const allDisplacements = Array.from({ length: MAX_ACTIONS }, (_, index) =>
  useDerivedValue(() => {
    if (index >= actions.length) return 0;
    const targetOffset = -(fabSize / 2 + spacing + itemSize / 2 + index * (itemSize + spacing));
    return animationProgress.value * targetOffset;
  })
);

// Then slice what you need:
const displacements = allDisplacements.slice(0, actions.length);
```

---

### 🔴 BUG #2 — CRITICAL: LiquidFAB canvas uses hardcoded pixel coordinates

**File:** [`LiquidFAB.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidFAB.tsx#L120-L131)

**Severity:** 🔴 Critical — Metaball blobs will be misaligned on any device that is not exactly 140×400px.

**Problem:**
```tsx
<Circle
  cx={styles.canvas.width / 2 || 70}   // ← Hardcoded fallback: 70px
  cy={styles.canvas.height / 2 || 270}  // ← Hardcoded fallback: 270px
  r={fabSize / 2}
  color={theme.accentColor}
/>
// ...
const cx = 70; // ← Hardcoded — will break on tablets/foldables
const cy = useDerivedValue(() => 270 + yOffset.value); // ← Hardcoded base
```

**Fix:** Use `onLayout` to measure the canvas and store dimensions in state or shared values:

```tsx
const [canvasSize, setCanvasSize] = useState({ width: 140, height: 400 });

<Canvas
  style={styles.canvas}
  onLayout={(e) => setCanvasSize({ 
    width: e.nativeEvent.layout.width, 
    height: e.nativeEvent.layout.height 
  })}
>
  <Circle
    cx={canvasSize.width / 2}
    cy={canvasSize.height - fabSize / 2} // Anchored to bottom
    r={fabSize / 2}
    color={theme.accentColor}
  />
```

---

### 🟠 BUG #3 — HIGH: `requestAnimationFrame` used in React Native context

**File:** [`LiquidView.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidView.tsx#L48-L58)

**Severity:** 🟠 High — `requestAnimationFrame` is a web API. While React Native polyfills it, it runs on the JS thread causing jank on the animation loop.

**Problem:**
```tsx
const updateShaderTime = () => {
  time.value = (Date.now() - startTime) / 1000;
  animationFrameId = requestAnimationFrame(updateShaderTime); // ← JS thread rAF
};
```

**Fix:** Use `react-native-reanimated`'s `useFrameCallback` which runs on the UI thread:

```tsx
import { useFrameCallback } from 'react-native-reanimated';

useFrameCallback((frameInfo) => {
  if (experimentalSkia) {
    time.value = frameInfo.timestamp / 1000;
  }
}, experimentalSkia);
```

---

### 🟠 BUG #4 — HIGH: `filter: 'blur(60px)'` is not valid in React Native StyleSheet

**File:** [`App.tsx`](file:///d:/liquidglass%20In%20react/App.tsx#L481)

**Severity:** 🟠 High — CSS `filter` property is not supported in React Native's `StyleSheet`. The ambient background blobs won't be blurred.

**Problem:**
```tsx
ambientBlob: {
  filter: 'blur(60px)', // ← CSS-only, silently ignored in RN
  opacity: 0.45,
},
```

**Fix:** Wrap each blob in a `BlurView` or use a Skia `<Canvas>` with `<Blur>`:

```tsx
import { BlurView } from 'expo-blur';

// Replace the View blobs with:
<BlurView intensity={60} tint="default" style={[styles.ambientBlob, styles.cyanBlob]} />
```

---

### 🟠 BUG #5 — HIGH: `interpolateScale` defined after use in `useAnimatedStyle`

**File:** [`LiquidFAB.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidFAB.tsx#L76-L96)

**Severity:** 🟠 High — `interpolateScale` is called inside `useAnimatedStyle` (a worklet) but is defined **after** the hook. While JS hoisting handles the function declaration, the `'worklet'` directive may not be correctly processed by the Reanimated Babel plugin since the function is referenced before its annotation is parsed.

**Problem:**
```tsx
const actionContainerStyles = actions.map((_, index) => {
  return useAnimatedStyle(() => {
    const scale = interpolateScale(animationProgress.value); // ← Used before defined
    ...
  });
});

const interpolateScale = (val: number) => { // ← Defined after use
  'worklet';
  return val;
};
```

**Fix:** Move `interpolateScale` before its first usage:

```tsx
// Move this ABOVE the useAnimatedStyle calls:
const interpolateScale = (val: number) => {
  'worklet';
  return val;
};
```

---

### 🟡 BUG #6 — MEDIUM: `src/index.ts` circular/invalid self-export

**File:** [`src/index.ts`](file:///d:/liquidglass%20In%20react/src/index.ts#L26-L27)

**Severity:** 🟡 Medium — These two lines at the bottom are both meaningless and potentially cyclic:

```tsx
export { index as default } from './index'; // ← Circular! exports itself
export const index = 'liquidrn';            // ← Exports a string as the module default
```

**Fix:** Remove both lines. A library's `index.ts` should not export itself:

```diff
- export { index as default } from './index';
- export const index = 'liquidrn';
```

---

### 🟡 BUG #7 — MEDIUM: Skia `BackdropFilter` + `RuntimeShader` layering is incorrect

**File:** [`LiquidView.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidView.tsx#L140-L151)

**Severity:** 🟡 Medium — The `<RuntimeShader>` is placed **inside** the `<BackdropFilter>` as a child, but a `RuntimeShader` is a paint modifier for the drawn geometry, not a backdrop filter child. The correct approach is to use `<BackdropFilter>` with only `<Blur>` and then draw the refraction effect separately.

**Problem:**
```tsx
<BackdropFilter filter={<Blur blur={skiaBlurRadius} />}>
  <RuntimeShader  {/* ← This is not how BackdropFilter children work */}
    source={refractionEffect}
    uniforms={skiaUniforms}
  />
</BackdropFilter>
```

In Skia for React Native, `BackdropFilter` renders a blurred version of what's behind it. A `RuntimeShader` as a direct child doesn't automatically sample the blurred backdrop as `image`. The `image` uniform needs to be explicitly connected to the snapshot.

**Fix:** Use `<Paint>` with `RuntimeShader` on a `<Fill>` that covers the canvas, or use the correct Skia API for backdrop sampling.

---

### 🟡 BUG #8 — MEDIUM: `use3DTiltAnimation` uses hardcoded element dimensions

**File:** [`useLiquidAnimation.ts`](file:///d:/liquidglass%20In%20react/src/hooks/useLiquidAnimation.ts#L129-L130)

**Severity:** 🟡 Medium — The tilt calculation uses `width: 300` and `height: 180` as hardcoded fallbacks. This means tilt responsiveness is incorrect for any card that isn't exactly 300×180.

**Problem:**
```tsx
const width = 300;  // ← hardcoded!
const height = 180; // ← hardcoded!
```

**Fix:** Expose `setDimensions` from the hook and call it in the card's `onLayout`:

```tsx
export const use3DTiltAnimation = (maxTiltX = 8, maxTiltY = 8) => {
  const dimensions = useSharedValue({ width: 300, height: 180 });
  
  const setDimensions = (w: number, h: number) => {
    dimensions.value = { width: w, height: h };
  };
  // ... use dimensions.value.width in handleTouchMove
  return { ..., setDimensions };
};
```

---

### 🟢 BUG #9 — LOW: `LiquidButton` `liquidView` has no `minHeight`

**File:** [`LiquidButton.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidButton.tsx#L233-L236)

**Severity:** 🟢 Low — The `liquidView` style uses `height: '100%'` but the parent `buttonWrapper` has no explicit height. If neither the button nor its parent have a fixed height, the button collapses to zero height.

**Fix:** Add a default `minHeight` to `innerContainer`:
```tsx
innerContainer: {
  paddingVertical: 12,
  paddingHorizontal: 24,
  minHeight: 48,   // ← Add this
},
```

---

### 🟢 BUG #10 — LOW: `LiquidModal` close animation race condition

**File:** [`LiquidModal.tsx`](file:///d:/liquidglass%20In%20react/src/components/LiquidModal.tsx#L58-L64)

**Severity:** 🟢 Low — `handleClose` uses a plain `setTimeout` to call `onClose()`, while `useEffect` uses another `setTimeout` to call `setShowModal(false)`. If `onClose` triggers a state change that re-renders the parent before the 250ms timer fires, the modal may flicker or animate twice.

**Fix:** Use `runOnJS` from Reanimated to schedule `onClose` after the animation completes:
```tsx
backdropOpacity.value = withTiming(0, { duration: 250 }, (finished) => {
  if (finished) runOnJS(onClose)();
});
```

---

## 🍎 Apple Liquid Glass Fidelity Assessment

How close is this library to Apple's actual iOS 26 / VisionOS Liquid Glass effect?

| Feature | Apple | liquidrn | Gap |
|---|---|---|---|
| Background blur | ✅ UIVisualEffectView | ✅ expo-blur | Minimal on iOS |
| Refraction distortion | ✅ Metal shaders | ⚠️ AGSL (BUG #7) | Shader layering is broken |
| Dynamic wave ripple | ✅ Real-time fluid | ⚠️ Sine wave approximation | Acceptable approximation |
| Specular highlights | ✅ Multi-light PBR | ⚠️ Single point Blinn-Phong | Simplified |
| Metaball morphing | ✅ Native CoreAnimation | ✅ Skia Blur+ColorMatrix | Good approximation |
| Edge rim glow | ✅ Native | ✅ AGSL `smoothstep` | Good |
| Ambient background blobs | ✅ SwiftUI mesh gradient | 🔴 CSS `filter: blur` (broken) | Not rendering |
| Spring physics | ✅ UISpringTimingParameters | ✅ Reanimated spring | Excellent |
| 3D parallax tilt | ✅ VisionOS hover | ⚠️ Hardcoded dimensions | Partially working |
| Scroll-linked blur | ✅ Native | ✅ Reanimated interpolate | Excellent |
| Gesture sheet physics | ✅ Native | ✅ RNGH v2 + spring | Excellent |
| Tab indicator morphing | ✅ Native | ✅ Asymmetric spring | Excellent |

**Overall Score: ~70% fidelity.** The spring physics, tab bar liquid indicator, and glass layering are excellent. The main gaps are the broken Skia refraction shader layering (BUG #7), missing ambient blur backgrounds (BUG #4), and the FAB metaball hook violations that prevent it from working with dynamic action counts (BUG #1).

---

## Roadmap

Suggested improvements to reach full Apple parity:

- [ ] Fix all critical bugs listed above (especially #1, #2, #7)
- [ ] Replace `requestAnimationFrame` with `useFrameCallback` for UI-thread shader updates
- [ ] Add `LiquidSearchBar` component (prominent in iOS 26)
- [ ] Add `LiquidAlert` for native-style alert dialogs
- [ ] Add `LiquidToggle` / `LiquidSlider` controls
- [ ] Implement mesh gradient backdrop (SwiftUI `MeshGradient` equivalent using Skia)
- [ ] Add proper `transformStyle: 'preserve-3d'` for true 3D card tilt
- [ ] Add Haptic feedback on all interactive elements
- [ ] Support `react-navigation` native stack integration for `LiquidNavbar`
- [ ] Publish to npm with proper `main`, `module`, and `types` fields
