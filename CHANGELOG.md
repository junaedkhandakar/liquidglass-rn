# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-11-15

### Added

- **`LiquidStepper`** — Apple iOS stepper with tap buttons and drag-to-scrub value.
- **`LiquidRating`** — Star rating rendered as frosted glass stars with a continuous fill overlay.
- **`LiquidBadge`** — Glass badge with optional counter bubble and three variants.
- **`LiquidToolbar`** — Frosted glass navigation toolbar with leading, center, and trailing slots.
- **`LiquidAlert`** — Inline frosted glass banner with semantic `info`, `success`, `warning`, and `error` variants.
- **`LiquidListHeader` / `LiquidSectionList`** — Collapsing Apple large-title header that transitions into a compact inline title on scroll.
- **Test suite** — Jest unit tests covering the public API surface, shaders, theme tokens, and style presets.
- **`CHANGELOG.md`**, **`CONTRIBUTING.md`**, ESLint configuration, and Jest configuration.

### Changed

- CI now runs on Node 20.x, 22.x, and 24.x and executes the unit test suite in addition to the typecheck.
- GitHub Pages workflow now auto-enables Pages via `enablement: true`.
- `package.json` exposes `lint` and `test` scripts.

## [1.1.0] - 2026-11-15

### Added

- **`LiquidSwitch`** — Apple iOS toggle switch with a liquid glass knob that stretches while travelling.
- **`LiquidSegmentedControl`** — iOS segmented control with a sliding liquid glass indicator using asymmetric fluid stretching physics.
- **`LiquidSearchBar`** — Frosted glass search capsule with focus glow, clear button, and spring focus expansion.
- **`LiquidIconButton`** — Circular glass icon button with spring press compression and three variants.
- **`LiquidProgressBar` / `LiquidSpinner`** — Apple-style progress bar with specular leading edge plus a rotating activity indicator.
- **`LiquidConfigProvider` / `useLiquidConfig`** — Global configuration for haptics, reduce motion, default intensity, and the Skia pipeline.
- **`LiquidSlider`** — Apple Control Center capsule slider with gesture drag tracking.
- **`triggerHaptic`** — Public haptic utility with graceful fallback when `expo-haptics` is not installed.

### Changed

- `LiquidCard` now accepts `stylePreset` (`'ios'` by default, `'visionos'` for 3D parallax tilt).
- All glass surfaces now render with Apple continuous curvature (`borderCurve: 'continuous'`).
- `REFRACTION_SHADER` now performs chromatic dispersion with per-channel refraction sampling.
- `LiquidView` renders a razor-sharp specular top bevel line.
- Dark theme updated to true OLED black with iOS System Blue accent.

### Accessibility

- Automatic detection of the OS **Reduce Motion** setting; disables parallax tilt, shine sweeps, and spring physics when enabled.
- Added `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` across all interactive components.
- Tap targets meet the 44pt minimum.
- Android hardware back button dismisses open sheets and modals.

### Platform

- Android uses `dimezisBlurView` for hardware-accelerated blur.
- Android edge-to-edge status bar insets handled in `LiquidNavbar`.
- Shadows are tuned per-platform (`Platform.select`) to avoid opaque Android elevation blocks.

## [1.0.4] - 2026-11-12

### Added

- Automatic npm publishing via GitHub Actions with npm Trusted Publishing (OIDC).
- Continuous integration workflow validating TypeScript across Node 20.x and 22.x.
- Interactive documentation website with a live device simulator.

### Fixed

- Rules of Hooks violation in `LiquidFAB` (hooks were called inside `actions.map`).
- Stale React state captured inside a Reanimated worklet in `LiquidTabBar`.
- Division-by-zero guards in `use3DTiltAnimation`.
- `Extrapolate` deprecation replaced with `Extrapolation` in `LiquidNavbar`.

## [1.0.3] - 2026-06-08

### Added

- Skia metaball fusion for the floating action button.
- Scroll-linked frosted navbar.

## [1.0.2] - 2026-06-08

### Added

- Initial public release of the liquid glass component suite.
