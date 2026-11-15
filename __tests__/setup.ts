// ---------------------------------------------------------------------------
// Test environment shims.
// Skia and Reanimated require native JSI bindings that do not exist in Node,
// so both are replaced with lightweight JavaScript equivalents.
// ---------------------------------------------------------------------------

jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createMockComponent = (name: string) => {
    const Component = (props: any) => React.createElement(View, props, props.children);
    Component.displayName = name;
    return Component;
  };

  return {
    Canvas: createMockComponent('Canvas'),
    Fill: createMockComponent('Fill'),
    Shader: createMockComponent('Shader'),
    Blur: createMockComponent('Blur'),
    Circle: createMockComponent('Circle'),
    Rect: createMockComponent('Rect'),
    BackdropFilter: createMockComponent('BackdropFilter'),
    ColorMatrix: createMockComponent('ColorMatrix'),
    Group: createMockComponent('Group'),
    Skia: {
      RuntimeEffect: {
        Make: () => ({ __mockRuntimeEffect: true }),
      },
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, ScrollView } = require('react-native');

  const noop = () => {};

  const AnimatedView = (props: any) => React.createElement(View, props, props.children);
  const AnimatedText = (props: any) => React.createElement(Text, props, props.children);
  const AnimatedImage = (props: any) => React.createElement(Image, props);
  const AnimatedScrollView = (props: any) => React.createElement(ScrollView, props, props.children);

  const chain = (value: any) => ({
    value,
    get: () => value,
    set: (v: any) => v,
    modify: () => {},
    addListener: noop,
    removeListener: noop,
  });

  const useSharedValue = (initial: any) => {
    const ref = React.useRef({ value: initial });
    return {
      get value() {
        return ref.current.value;
      },
      set value(v: any) {
        ref.current.value = v;
      },
      get() {
        return ref.current.value;
      },
      set(v: any) {
        ref.current.value = v;
      },
      modify: noop,
      addListener: noop,
      removeListener: noop,
    };
  };

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      Text: AnimatedText,
      Image: AnimatedImage,
      ScrollView: AnimatedScrollView,
      createAnimatedComponent: (c: any) => c,
    },
    View: AnimatedView,
    Text: AnimatedText,
    Image: AnimatedImage,
    ScrollView: AnimatedScrollView,
    createAnimatedComponent: (c: any) => c,
    useSharedValue,
    useDerivedValue: (fn: any, deps?: any[]) => {
      const value = fn();
      return value;
    },
    useAnimatedStyle: (fn: any) => {
      try {
        return fn();
      } catch {
        return {};
      }
    },
    useAnimatedProps: (fn: any) => {
      try {
        return fn();
      } catch {
        return {};
      }
    },
    useAnimatedReaction: noop,
    useAnimatedScrollHandler: () => noop,
    useAnimatedGestureHandler: () => noop,
    useFrameCallback: noop,
    useEvent: () => noop,
    useHandler: () => ({ context: {}, doDependenciesDiffer: false }),
    useWorkletCallback: (fn: any) => fn,
    withSpring: (v: any) => v,
    withTiming: (v: any) => v,
    withDelay: (_d: any, v: any) => v,
    withRepeat: (v: any) => v,
    withSequence: (...v: any[]) => v[v.length - 1],
    cancelAnimation: noop,
    interpolate: (v: number) => v,
    interpolateColor: (v: number) => v,
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Easing: {
      linear: (t: number) => t,
      bezier: () => (t: number) => t,
      inOut: (fn: any) => fn,
      ease: (t: number) => t,
    },
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
    measure: () => Promise.resolve({ x: 0, y: 0, width: 0, height: 0 }),
    scrollTo: noop,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  const GestureBuilder = () => {
    const api: any = {
      onStart: () => api,
      onUpdate: () => api,
      onEnd: () => api,
      onBegin: () => api,
      onFinalize: () => api,
      enabled: () => api,
      simultaneousWithExternalGesture: () => api,
      requireExternalGestureToFail: () => api,
      activeOffsetX: () => api,
      activeOffsetY: () => api,
      failOffsetX: () => api,
      failOffsetY: () => api,
    };
    return api;
  };

  return {
    GestureDetector: (props: any) => React.createElement(View, props, props.children),
    Gesture: {
      Pan: GestureBuilder,
      Tap: GestureBuilder,
      LongPress: GestureBuilder,
      Fling: GestureBuilder,
      Native: GestureBuilder,
    },
    GestureHandlerRootView: (props: any) => React.createElement(View, props, props.children),
  };
});
