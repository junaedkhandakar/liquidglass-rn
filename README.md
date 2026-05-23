# 💧 LiquidRN

<p align="center">
  <strong>High-Performance, Apple VisionOS-Inspired "Liquid Glass" UI Elements for React Native & Expo</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#publishing-to-npm">Publishing</a> •
  <a href="#license">License</a>
</p>

---

LiquidRN is a state-of-the-art, open-source React Native UI library designed to recreate the stunning, premium, highly tactile **Apple "Liquid Glass"** visual and gesture animations. Engineered with native GPU acceleration, LiquidRN brings the high-fidelity frosted glassmorphism, dynamic specular shines, real-time background refractions, and organic merging "liquid metaball" animations of VisionOS and iOS 18 directly to your mobile applications.

---

## ✨ Features

- 🧊 **Frosted Glass Blur**: Premium, customizable background blurring using native GPU filters with customizable intensity and adaptive dark/light tinting.
- 🔮 **Skia-Powered Refractions**: Custom AGSL (Android Graphics Shading Language) shaders that warp background pixels based on layout dimensions, simulating realistic physical lenses.
- 💫 **Tactile 3D Parallax**: High-fidelity spring-loaded cards that follow touch coordinates in 3D perspective space.
- ⚡ **Dynamic Specular Shine**: Specular light highlights sweeping across glass buttons and cards automatically or reacting directly to user touch events.
- 💧 **Organic Liquid Metaballs**: Fluid droplet merging and division physics (used in `LiquidTabBar` and `LiquidFAB`) achieved using Gaussian Blurs and high-contrast color matrix thresholding on the GPU thread.
- 🎛️ **Scroll-Linked Progressive Blurs**: Navbar blur intensity and borders dynamically fading in sync with content scroll offsets.
- 🛠️ **Fully Typed TypeScript**: 100% type-safe, modular, and tree-shakable exports designed for frictionless integration.

---

## 📦 Installation

Install the library along with its peer dependencies using the Expo CLI. This guarantees that compatible versions for your specific Expo SDK will be selected automatically:

```bash
npx expo install liquidrn react-native-reanimated @shopify/react-native-skia expo-blur react-native-svg react-native-gesture-handler lucide-react-native
```

### Peer Dependencies Note
Ensure you wrap the root of your application in both `GestureHandlerRootView` (from `react-native-gesture-handler`) and `LiquidThemeProvider` (from `liquidrn`):

```tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LiquidThemeProvider } from 'liquidrn';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LiquidThemeProvider defaultMode="dark">
        <Dashboard />
      </LiquidThemeProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 🚀 Quick Start

### 1. Specular Parallax Card (`LiquidCard`)

```tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LiquidCard } from 'liquidrn';

export default function ProfileCard() {
  return (
    <LiquidCard
      intensity={60}
      shadowDepth="high"
      borderGlow={true}
      interactive={true} // Enables 3D touch tilt parallax
      shineSpeed={4000}  // Continuously sweeps reflections
      style={styles.card}
    >
      <Text style={styles.title}>Amethyst Aurora</Text>
      <Text style={styles.desc}>Apple VisionOS Liquid Glass Card</Text>
    </LiquidCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 180,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  desc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
});
```

### 2. GPU-Accelerated Ripple Button (`LiquidButton`)

```tsx
import React from 'react';
import { LiquidButton } from 'liquidrn';

export default function ActionButton() {
  return (
    <LiquidButton
      variant="glass"
      title="Tactile Click Ripple"
      glow={true}
      liquidRipple={true} // Spreads an organic Skia liquid ripple from touch location
      scaleOnPress={true}  // Dynamic spring bounce scale down
      onPress={() => console.log('Tapped!')}
    />
  );
}
```

### 3. Asymmetric Liquid Navigation Bar (`LiquidTabBar`)

```tsx
import React, { useState } from 'react';
import { LiquidTabBar } from 'liquidrn';

export default function Navigation() {
  const [index, setIndex] = useState(0);
  const routes = [
    { key: 'widgets', title: 'Widgets', icon: 'Layers' as const },
    { key: 'playground', title: 'Playground', icon: 'Sliders' as const },
    { key: 'overlays', title: 'Overlays', icon: 'Expand' as const },
  ];

  return (
    <LiquidTabBar
      routes={routes}
      activeIndex={index}
      onChange={setIndex}
    />
  );
}
```

---

## 📘 API Reference

### `LiquidView`
*The foundational glass boundary layer.*

| Prop | Type | Default | Description |
|---|---|---|---|
| `intensity` | `number \| SharedValue<number>` | `50` | Opacity and frosting density of the glass (0 to 100). |
| `tint` | `'light' \| 'dark' \| 'none'` | Theme auto | Forced color overlay tinting. |
| `experimentalSkia` | `boolean` | `false` | Enables AGSL refraction shaders for background warps. |
| `borderGlow` | `boolean` | `false` | Enables glowing border ring catch lights. |
| `glowColor` | `string` | Theme accent | Glow shadow color for the border. |
| `borderRadius` | `number` | `20` | Corner rounding radius. |

---

### `LiquidCard`
*Interactive 3D container card.*

| Prop | Type | Default | Description |
|---|---|---|---|
| `interactive` | `boolean` | `true` | Enables 3D parallax finger-tilt rotations on touch. |
| `shineSpeed` | `number` | `4000` | Specular sweep intervals in ms (0 to disable). |
| `shineOnTouch` | `boolean` | `true` | Instantly flashes a bright shine sweep on press. |
| `shadowDepth` | `'low' \| 'medium' \| 'high'` | `'medium'` | Layered drop shadow depth radius coefficients. |

---

### `LiquidButton`
*Tactile glass pressable.*

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'glass'` | `'glass'` | Visual visual fill preset of the pressable. |
| `liquidRipple` | `boolean` | `true` | Enables organic Skia alpha-fusion ripple on touch coordinate. |
| `shineOnPress` | `boolean` | `true` | Sweeps a sharp reflection highlight across on touch. |
| `scaleOnPress` | `boolean` | `true` | Spring compresses the button scale slightly on active hold. |
| `glow` | `boolean` | `false` | Backs the glass button with a pulsing ambient accent glow. |

---

### `LiquidFAB`
*Liquid-morphing floating action bubble.*

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `keyof typeof Icons` | `'Plus'` | Name of the Lucide icon for the main floating action button. |
| `glow` | `boolean` | `true` | Applies premium ambient shadowing glow matching standard FAB size. |
| `actions` | `FABAction[]` | Required | Array of action coordinates `{ icon, label, onPress }` bubbling out. |

---

## 📦 Publishing to npm

LiquidRN uses a modern tree-shakable structure. Follow this checklist to build and release to npm:

### 1. Compile Check & Typings Validation
Run a local type safety check before packaging:
```bash
npm run typecheck
```

### 2. Versioning
Bump version according to SemVer inside `package.json`:
```json
"version": "1.0.0"
```

### 3. Log In to npm Registry
Ensure you are logged into your npm account in the console:
```bash
npm login
```

### 4. Publish Package
Deploy the tree-shakable sources directly to npm:
```bash
npm publish --access public
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/liquidglass%20In%20react/LICENSE) file for details.
