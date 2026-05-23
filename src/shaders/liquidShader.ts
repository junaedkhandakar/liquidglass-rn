/**
 * Liquid Metaball Fusion Matrix.
 * When applied to a blurred group of shapes, this color matrix creates
 * a high-contrast thresholding on the alpha channel.
 * 
 * Matrix columns: [R, G, B, A, Bias]
 * The fourth row represents the Alpha channel: [0, 0, 0, 20, -10]
 * - Multiplies the blurred alpha by 20
 * - Subtracts 10 (bias)
 * - This clamps the soft blur into a sharp, solid organic boundary.
 */
export const LIQUID_FUSION_COLOR_MATRIX = [
  1, 0, 0, 0, 0,     // Red
  0, 1, 0, 0, 0,     // Green
  0, 0, 1, 0, 0,     // Blue
  0, 0, 0, 24, -12,  // Alpha (high gain and offset for razor-sharp liquid edges)
];

/**
 * AGSL Shader for organic plasma/liquid movement.
 * Can be loaded inside Skia shapes to create a fluid, morphing lava-lamp style pattern.
 */
export const LIQUID_PLASMA_SHADER = `
  uniform vec2 resolution;
  uniform float uTime;
  uniform vec3 uColor1; // HSL Accent 1
  uniform vec3 uColor2; // HSL Accent 2

  half4 main(vec2 coord) {
    vec2 uv = coord / resolution;
    
    // Wave overlay to create a plasma effect
    float w1 = sin(uv.x * 4.0 + uTime) + sin(uv.y * 2.0 + uTime * 0.8);
    float w2 = cos(uv.y * 3.0 - uTime * 1.2) + cos(uv.x * 5.0 - uTime);
    float wave = (w1 + w2) * 0.25 + 0.5; // normalized 0 to 1
    
    // Mix the two theme-curated accent colors based on wave heights
    vec3 mixColor = mix(uColor1, uColor2, wave);
    
    // Ambient liquid glow
    return vec4(mixColor, 0.95);
  }
`;
