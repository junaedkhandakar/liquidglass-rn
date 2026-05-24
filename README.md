# 💧 LiquidRN

<p align="center">
  <strong>High-Performance, Apple VisionOS-Inspired "Liquid Glass" UI Elements for React Native &amp; Expo</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-theme-system">Theme</a> •
  <a href="#-components">Components</a> •
  <a href="#-hooks">Hooks</a> •
  <a href="#-shaders">Shaders</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-license">License</a>
</p>

---

LiquidRN is a state-of-the-art, open-source React Native UI library designed to recreate the stunning, premium, highly tactile **Apple "Liquid Glass"** visual and gesture animations. Engineered with native GPU acceleration, LiquidRN brings the high-fidelity frosted glassmorphism, dynamic specular shines, real-time background refractions, and organic merging "liquid metaball" animations of VisionOS and iOS 26 directly to your mobile applications.

---

## 🏗️ Architecture

```
App
└── GestureHandlerRootView
    └── LiquidThemeProvider (ThemeContext)
        └── Your App
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

| Layer | Technology |
|---|---|
| Background blur (cross-platform) | `expo-blur` BlurView |
| GPU refraction shaders | `@shopify/react-native-skia` AGSL |
| Organic metaball blending | Skia `Blur + ColorMatrix` trick |
| Spring-physics animations | `react-native-reanimated` v3 |
| Gesture handling | `react-native-gesture-handler` v2 |
| Icons | `lucide-react-native` |

---

## ✨ Features

- 🧊 **Frosted Glass Blur** — Premium, customizable background blurring using native GPU filters with customizable intensity and adaptive dark/light tinting.
- 🔮 **Skia-Powered Refractions** — Custom AGSL shaders that warp background pixels based on layout dimensions, simulating realistic physical lenses.
- 💫 **Tactile 3D Parallax** — High-fidelity spring-loaded cards that follow touch coordinates in 3D perspective space.
- ⚡ **Dynamic Specular Shine** — Specular light highlights sweeping across glass buttons and cards automatically or on touch.
- 💧 **Organic Liquid Metaballs** — Fluid droplet merging physics in `LiquidTabBar` and `LiquidFAB` via Gaussian blur + color matrix GPU thresholding.
- 🎛️ **Scroll-Linked Progressive Blurs** — Navbar blur intensity and borders fading in sync with scroll offset.
- 🛠️ **Fully Typed TypeScript** — 100% type-safe, modular, and tree-shakable exports.

---

## 📦 Installation

Install the library along with its peer dependencies using the Expo CLI:

```bash
npx expo install liquidrn @shopify/react-native-skia expo-blur react-native-reanimated react-native-gesture-handler react-native-svg lucide-react-native
```

> **Expo SDK 54+ required.** Skia GPU shaders require an Expo Development Client build — they do **not** work in Expo Go.

---

## 🚀 Quick Start

Always wrap your app root with `GestureHandlerRootView` and `LiquidThemeProvider`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LiquidThemeProvider, LiquidCard, LiquidButton } from 'liquidrn';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LiquidThemeProvider defaultMode="system"> {/* 'light' | 'dark' | 'system' */}
        <LiquidCard intensity={55} shadowDepth="medium">
          <LiquidButton variant="primary" title="Tap Me" glow />
        </LiquidCard>
      </LiquidThemeProvider>
    </GestureHandlerRootView>
  );
}
```

### Specular Parallax Card

```tsx
import { LiquidCard } from 'liquidrn';

<LiquidCard
  intensity={60}
  shadowDepth="high"
  borderGlow={true}
  interactive={true}   // Enables 3D touch tilt parallax
  shineSpeed={4000}    // Continuously sweeps reflections
  style={{ width: 320, height: 180 }}
>
  <Text>Amethyst Aurora</Text>
</LiquidCard>
```

### GPU-Accelerated Ripple Button

```tsx
import { LiquidButton } from 'liquidrn';

<LiquidButton
  variant="glass"
  title="Tactile Click Ripple"
  glow={true}
  liquidRipple={true}  // Organic Skia ripple from touch location
  scaleOnPress={true}  // Dynamic spring bounce
  onPress={() => console.log('Tapped!')}
/>
```

### Asymmetric Liquid Tab Bar

```tsx
import { useState } from 'react';
import { LiquidTabBar } from 'liquidrn';

const routes = [
  { key: 'home', title: 'Home', icon: 'Home' as const },
  { key: 'search', title: 'Search', icon: 'Search' as const },
  { key: 'profile', title: 'Profile', icon: 'User' as const },
];

const [index, setIndex] = useState(0);

<LiquidTabBar routes={routes} activeIndex={index} onChange={setIndex} />
```

### Scroll-Linked Navbar

```tsx
import { useSharedValue } from 'react-native-reanimated';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { LiquidNavbar } from 'liquidrn';

const scrollY = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (e) => { scrollY.value = e.contentOffset.y; },
});

<LiquidNavbar title="My App" scrollY={scrollY} maxScrollOffset={80} />
<Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
  {/* content */}
</Animated.ScrollView>
```

---

## 🎨 Theme System

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

## 🧩 Components

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

| Prop | Type | Default | Description |
|---|---|---|---|
| `intensity` | `number \| SharedValue<number>` | `50` | Blur strength (0–100). Supports live Reanimated values. |
| `tint` | `'light' \| 'dark' \| 'none'` | Auto from theme | Background tint flavor |
| `experimentalSkia` | `boolean` | `false` | Swap expo-blur for Skia AGSL refraction shader |
| `borderGlow` | `boolean` | `false` | Rim light glow effect |
| `glowColor` | `string` | Theme glow | Custom RGBA color for the glow |
| `borderRadius` | `number` | `20` | Corner radius |

**Rendering Modes:**

- **Native BlurView** (default): Maps to `UIVisualEffectView` on iOS and `BlurDrawable` on Android. Best cross-platform compatibility.
- **Skia Refraction** (`experimentalSkia={true}`): Custom AGSL runtime shader with wave distortion, specular highlights, and edge glow. Requires native build.

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

| Prop | Type | Default | Description |
|---|---|---|---|
| `interactive` | `boolean` | `true` | Enables 3D tilt + press scale |
| `shineSpeed` | `number` | `4000` | Specular shine sweep interval in ms |
| `shineOnTouch` | `boolean` | `true` | Trigger shine on tap |
| `shadowDepth` | `'low' \| 'medium' \| 'high'` | `'medium'` | Layered shadow preset |
| All `LiquidViewProps` | — | — | Passed through to the inner `LiquidView` |

> `LiquidCard` extends `LiquidViewProps` — all `LiquidView` props work here too.

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
const routes = [
  { key: 'home', title: 'Home', icon: 'Home' },      // Lucide icon names
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

| Prop | Type | Default | Description |
|---|---|---|---|
| `routes` | `TabRoute[]` | required | Array of tab definitions |
| `activeIndex` | `number` | required | Controlled active tab |
| `onChange` | `(index) => void` | required | Tab change callback |
| `activeColor` | `string` | Theme accent | Icon/label color when active |
| `inactiveColor` | `string` | Theme subtext | Icon/label color when inactive |

```ts
interface TabRoute {
  key: string;
  title: string;
  icon: keyof typeof Icons; // Any Lucide icon name
}
```

---

### `LiquidFAB`

A floating action button that expands into a cluster of organic Skia metaball bubbles. Supports up to **8 actions**.

```tsx
const actions = [
  { icon: 'Camera', label: 'Camera', onPress: openCamera },
  { icon: 'Image', label: 'Gallery', onPress: openGallery },
  { icon: 'Mic', label: 'Record', onPress: startRecording },
];

<LiquidFAB
  icon="Plus"      // Main button icon (Lucide name)
  actions={actions}
  glow={true}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `keyof typeof Icons` | `'Plus'` | Main FAB icon (Lucide name) |
| `actions` | `FABAction[]` | required | Array of expandable actions (max 8) |
| `glow` | `boolean` | `true` | Neon glow shadow on main button |

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

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | required | Show/hide the modal |
| `onClose` | `() => void` | required | Called when dismissed |
| `blurBackdrop` | `boolean` | `true` | Blur the screen behind the modal |
| `experimentalSkia` | `boolean` | `false` | Pass-through to inner `LiquidCard` |
| `children` | `ReactNode` | required | Modal content |

> The modal uses a delayed unmount so exit animations play before the modal is removed from the tree.

---

### `LiquidSheet`

A draggable bottom sheet with spring physics and elastic rubber-banding.

```tsx
<LiquidSheet
  isOpen={sheetOpen}
  onClose={() => setSheetOpen(false)}
  height={SCREEN_HEIGHT * 0.65}  // Custom height (default: 65%)
>
  <Text>Drawer Content</Text>
</LiquidSheet>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | required | Controls sheet visibility |
| `onClose` | `() => void` | required | Called when sheet is dismissed |
| `height` | `number` | `65% of screen` | Sheet panel height in pixels |
| `children` | `ReactNode` | required | Sheet content |

**Gesture behavior:**
- Drag down **> 120px** → closes with spring animation
- Drag down with velocity **> 600** → snaps closed instantly
- Drag up beyond top → elastic rubber-band resistance (0.2× factor)

---

## 🎣 Hooks

### `usePressAnimation(scaleTo?)`

Spring scale-down animation for press interactions.

```tsx
const { scale, pressStyle, pressHandlers } = usePressAnimation(0.94);
// Use pressHandlers.onPressIn and pressHandlers.onPressOut on any Pressable
```

### `useShineAnimation(speed?, autostart?)`

Sweeping specular highlight animation.

```tsx
const { shineProgress, triggerManualShine } = useShineAnimation(3000, false);
triggerManualShine(600); // Trigger a 600ms sweep manually on demand
```

### `use3DTiltAnimation(maxTiltX?, maxTiltY?)`

VisionOS-style 3D parallax tilt based on touch location.

```tsx
const { tiltStyle, glowStyle, setDimensions, tiltHandlers } = use3DTiltAnimation(10, 10);

// Wire real card dimensions for accurate tilt sensitivity:
<Animated.View
  style={tiltStyle}
  onLayout={(e) => setDimensions(e.nativeEvent.layout.width, e.nativeEvent.layout.height)}
  {...tiltHandlers}
/>
```

### Spring Config Constants

```tsx
import { APPLE_SPRING_CONFIG, APPLE_BOUNCE_CONFIG } from 'liquidrn';

// APPLE_SPRING_CONFIG: { damping: 18, mass: 0.8, stiffness: 150 }
// APPLE_BOUNCE_CONFIG: { damping: 12, mass: 0.5, stiffness: 220 }
```

---

## 🖥️ Shaders

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

The alpha row `[0, 0, 0, 24, -12]` multiplies blurred alpha by 24 then subtracts 12 — clipping the soft blur into a razor-sharp liquid boundary.

### `REFRACTION_SHADER` (AGSL)

An AGSL runtime shader for Skia that simulates thick liquid glass refraction:

- **Wave distortion** — sine/cosine UV displacement
- **Lens pinch** — barrel-distortion-style center refraction
- **Specular highlight** — Blinn-Phong hot spot from a virtual light source
- **Edge glow** — Ambient rim light at glass boundaries

| Uniform | Type | Description |
|---|---|---|
| `image` | `shader` | The captured backdrop image |
| `resolution` | `vec2` | Canvas dimensions |
| `uLightPos` | `vec2` | Virtual light source position |
| `uTime` | `float` | Animated time for wave motion |
| `uDistortionStrength` | `float` | Wave amplitude (0.0–0.15) |
| `uSpecularIntensity` | `float` | Specular highlight strength |

---

## 📦 Publishing to npm

### 1. Type-check
```bash
npm run typecheck
```

### 2. Bump version in `package.json`
```json
"version": "1.0.1"
```

### 3. Login & publish
```bash
npm login
npm publish --access public
```

---

## 🍎 Apple Liquid Glass Fidelity

How close is this library to Apple's actual iOS 26 / VisionOS Liquid Glass effect?

| Feature | Apple | liquidrn | Notes |
|---|---|---|---|
| Background blur | ✅ UIVisualEffectView | ✅ expo-blur | Minimal gap on iOS |
| Refraction distortion | ✅ Metal shaders | ✅ AGSL two-pass | Fixed in v1.0+ |
| Dynamic wave ripple | ✅ Real-time fluid | ⚠️ Sine approximation | Acceptable |
| Specular highlights | ✅ Multi-light PBR | ⚠️ Single Blinn-Phong | Simplified |
| Metaball morphing | ✅ CoreAnimation | ✅ Skia Blur+ColorMatrix | Great approximation |
| Edge rim glow | ✅ Native | ✅ AGSL `smoothstep` | Great |
| Ambient blobs | ✅ SwiftUI MeshGradient | ✅ expo-blur BlurView | Fixed in v1.0+ |
| Spring physics | ✅ UISpringTimingParameters | ✅ Reanimated spring | Excellent |
| 3D parallax tilt | ✅ VisionOS hover | ✅ Dynamic layout dims | Fixed in v1.0+ |
| Scroll-linked blur | ✅ Native | ✅ Reanimated interpolate | Excellent |
| Gesture sheet physics | ✅ Native | ✅ RNGH v2 + spring | Excellent |
| Tab indicator morphing | ✅ Native | ✅ Asymmetric spring | Excellent |

---

## 🗺️ Roadmap

- [x] Core glass surface (`LiquidView`)
- [x] Interactive card with 3D tilt (`LiquidCard`)
- [x] Ripple button (`LiquidButton`)
- [x] Scroll-linked navbar (`LiquidNavbar`)
- [x] Asymmetric tab bar (`LiquidTabBar`)
- [x] Metaball FAB (`LiquidFAB`)
- [x] Spring modal (`LiquidModal`)
- [x] Gesture bottom sheet (`LiquidSheet`)
- [ ] `LiquidSearchBar` — prominent in iOS 26
- [ ] `LiquidAlert` — native-style alert dialogs
- [ ] `LiquidToggle` / `LiquidSlider` — form controls
- [ ] Mesh gradient backdrop (SwiftUI `MeshGradient` via Skia)
- [ ] `transformStyle: 'preserve-3d'` for true 3D card tilt
- [ ] Haptic feedback on all interactive elements
- [ ] `react-navigation` native stack integration

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
