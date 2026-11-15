import * as liquidglassRn from '../src/index';

describe('public API', () => {
  it('exports every documented component', () => {
    expect(liquidglassRn.LiquidView).toBeDefined();
    expect(liquidglassRn.LiquidCard).toBeDefined();
    expect(liquidglassRn.LiquidButton).toBeDefined();
    expect(liquidglassRn.LiquidSlider).toBeDefined();
    expect(liquidglassRn.LiquidSwitch).toBeDefined();
    expect(liquidglassRn.LiquidSegmentedControl).toBeDefined();
    expect(liquidglassRn.LiquidSearchBar).toBeDefined();
    expect(liquidglassRn.LiquidIconButton).toBeDefined();
    expect(liquidglassRn.LiquidProgressBar).toBeDefined();
    expect(liquidglassRn.LiquidSpinner).toBeDefined();
    expect(liquidglassRn.LiquidStepper).toBeDefined();
    expect(liquidglassRn.LiquidRating).toBeDefined();
    expect(liquidglassRn.LiquidBadge).toBeDefined();
    expect(liquidglassRn.LiquidToolbar).toBeDefined();
    expect(liquidglassRn.LiquidAlert).toBeDefined();
    expect(liquidglassRn.LiquidListHeader).toBeDefined();
    expect(liquidglassRn.LiquidSectionList).toBeDefined();
    expect(liquidglassRn.LiquidTabBar).toBeDefined();
    expect(liquidglassRn.LiquidNavbar).toBeDefined();
    expect(liquidglassRn.LiquidModal).toBeDefined();
    expect(liquidglassRn.LiquidFAB).toBeDefined();
    expect(liquidglassRn.LiquidSheet).toBeDefined();
  });

  it('exports the theme provider and hooks', () => {
    expect(liquidglassRn.LiquidThemeProvider).toBeDefined();
    expect(liquidglassRn.useTheme).toBeDefined();
    expect(liquidglassRn.useLiquidConfig).toBeDefined();
    expect(liquidglassRn.LiquidConfigProvider).toBeDefined();
    expect(liquidglassRn.usePressAnimation).toBeDefined();
    expect(liquidglassRn.useShineAnimation).toBeDefined();
    expect(liquidglassRn.use3DTiltAnimation).toBeDefined();
  });

  it('exports the shader and style utilities', () => {
    expect(liquidglassRn.REFRACTION_SHADER).toBeDefined();
    expect(liquidglassRn.LIQUID_FUSION_COLOR_MATRIX).toBeDefined();
    expect(liquidglassRn.LIQUID_PLASMA_SHADER).toBeDefined();
    expect(liquidglassRn.lightTheme).toBeDefined();
    expect(liquidglassRn.darkTheme).toBeDefined();
    expect(liquidglassRn.glassStyles).toBeDefined();
    expect(liquidglassRn.layoutStyles).toBeDefined();
    expect(liquidglassRn.triggerHaptic).toBeDefined();
  });

  it('exports the Apple spring configurations', () => {
    expect(liquidglassRn.APPLE_SPRING_CONFIG.damping).toBeGreaterThan(0);
    expect(liquidglassRn.APPLE_BOUNCE_CONFIG.stiffness).toBeGreaterThan(0);
  });
});
