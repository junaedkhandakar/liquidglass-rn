# Contributing to liquidglass-rn

Thanks for helping improve liquidglass-rn.

## Getting Started

```bash
git clone https://github.com/junaedkhandakar/liquidglass-rn.git
cd liquidglass-rn
npm install
npm start
```

## Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Expo dev server for the demo app. |
| `npm run ios` / `npm run android` | Starts the dev server targeting a specific platform. |
| `npm run web` | Runs the demo app in the browser. |
| `npm run typecheck` | Runs `tsc --noEmit` with strict mode. |
| `npm run docs` | Serves the documentation website locally on port 3000. |

## Guidelines

1. **Keep the public API typed.** Every component prop must be declared in an exported interface.
2. **Never break Rules of Hooks.** Hooks must not be called inside loops, conditionals, or `.map()` callbacks. Pre-allocate a fixed number of hooks instead.
3. **Keep animations on the UI thread.** Use Reanimated shared values and worklets. Avoid reading React state inside `useAnimatedStyle`.
4. **Respect Reduce Motion.** Any new animation must check `useLiquidConfig().reduceMotion`.
5. **Support both platforms.** Use `Platform.select` for shadows, blur methods, and system insets.
6. **Add accessibility.** Interactive components need `accessibilityRole`, `accessibilityState`, and `accessibilityLabel`.

## Adding a Component

1. Create `src/components/LiquidYourComponent.tsx`.
2. Export the component and its props from `src/index.ts`.
3. Document it in `README.md` with a props table.
4. Add it to the demo app in `App.tsx`.
5. Add a preview to the website in `docs/`.

## Pull Requests

- Keep changes focused; one feature per PR.
- Run `npm run typecheck` before pushing.
- Update `CHANGELOG.md` under the Unreleased section.

## Reporting Bugs

Open an issue with the following details:
- Platform and OS version
- Expo SDK and React Native versions
- Whether `experimentalSkia` is enabled
- A minimal reproduction snippet
