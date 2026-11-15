import {
  LIQUID_FUSION_COLOR_MATRIX,
  LIQUID_PLASMA_SHADER,
} from '../src/shaders/liquidShader';
import { REFRACTION_SHADER } from '../src/shaders/refractionShader';
import { lightTheme, darkTheme } from '../src/utils/theme';
import { glassStyles, layoutStyles } from '../src/utils/glassStyles';

describe('shaders', () => {
  it('exports a 20-value liquid fusion color matrix', () => {
    expect(LIQUID_FUSION_COLOR_MATRIX).toHaveLength(20);
  });

  it('uses a high alpha gain with a negative bias to threshold blurred shapes', () => {
    const alphaRow = LIQUID_FUSION_COLOR_MATRIX.slice(15, 20);
    expect(alphaRow[3]).toBeGreaterThanOrEqual(20);
    expect(alphaRow[4]).toBeLessThan(0);
  });

  it('exports an AGSL refraction shader with the required uniforms', () => {
    expect(REFRACTION_SHADER).toContain('uniform shader image');
    expect(REFRACTION_SHADER).toContain('uniform vec2 resolution');
    expect(REFRACTION_SHADER).toContain('uniform float uTime');
    expect(REFRACTION_SHADER).toContain('uniform float uDistortionStrength');
    expect(REFRACTION_SHADER).toContain('uniform float uSpecularIntensity');
  });

  it('samples the backdrop image for refraction', () => {
    expect(REFRACTION_SHADER).toContain('image.eval');
  });

  it('exports a plasma shader', () => {
    expect(LIQUID_PLASMA_SHADER).toContain('uniform float uTime');
    expect(LIQUID_PLASMA_SHADER).toContain('half4 main');
  });
});

describe('theme', () => {
  it('defines a light theme with a non-dark flag', () => {
    expect(lightTheme.isDark).toBe(false);
    expect(lightTheme.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('defines a dark theme with a dark flag', () => {
    expect(darkTheme.isDark).toBe(true);
    expect(darkTheme.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('keeps text and subtext colors distinct', () => {
    expect(lightTheme.textColor).not.toBe(lightTheme.subtextColor);
    expect(darkTheme.textColor).not.toBe(darkTheme.subtextColor);
  });
});

describe('glassStyles', () => {
  it('provides low, medium and high shadow presets', () => {
    expect(glassStyles.shadows.low).toBeInstanceOf(Function);
    expect(glassStyles.shadows.medium).toBeInstanceOf(Function);
    expect(glassStyles.shadows.high).toBeInstanceOf(Function);
  });

  it('returns a style object for every shadow depth and theme', () => {
    (['low', 'medium', 'high'] as const).forEach((depth) => {
      const light = glassStyles.shadows[depth](false);
      const dark = glassStyles.shadows[depth](true);
      expect(typeof light).toBe('object');
      expect(typeof dark).toBe('object');
    });
  });

  it('exposes layout helpers', () => {
    expect(layoutStyles.center).toBeDefined();
    expect(layoutStyles.row).toBeDefined();
    expect(layoutStyles.absoluteFill).toBeDefined();
    expect(layoutStyles.overflowHidden).toBeDefined();
  });
});
