/**
 * AGSL Refraction Shader for React Native Skia.
 * Simulates a thick liquid glass surface that refracts whatever is behind it,
 * adds dynamic surface wave distortion, chromatic dispersion, and computes specular glares.
 */
export const REFRACTION_SHADER = `
  uniform shader image;
  uniform vec2 resolution;
  uniform vec2 uLightPos;
  uniform float uTime;
  uniform float uDistortionStrength; // 0.0 to 0.15
  uniform float uSpecularIntensity; // 0.0 to 1.0

  half4 main(vec2 coord) {
    vec2 uv = coord / resolution;
    
    // Soft dynamic liquid ripples using harmonic sine/cosine math
    float waveX = sin(uv.y * 10.0 + uTime * 2.0) * cos(uv.x * 5.0 + uTime * 1.5);
    float waveY = cos(uv.x * 12.0 + uTime * 1.8) * sin(uv.y * 6.0 + uTime * 1.2);
    vec2 waveOffset = vec2(waveX, waveY) * uDistortionStrength;
    
    // Lens refraction: pull coordinates slightly towards the center (optical pinch)
    vec2 center = vec2(0.5, 0.5);
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    vec2 pinchOffset = toCenter * (dist * dist) * 0.09;
    
    // Chromatic dispersion: sample R, G, B at micro-shifted refraction angles
    vec2 redCoord   = (uv + waveOffset * 1.05 + pinchOffset * 1.04) * resolution;
    vec2 greenCoord = (uv + waveOffset        + pinchOffset       ) * resolution;
    vec2 blueCoord  = (uv + waveOffset * 0.95 + pinchOffset * 0.96) * resolution;
    
    half4 colorR = image.eval(redCoord);
    half4 colorG = image.eval(greenCoord);
    half4 colorB = image.eval(blueCoord);
    half4 color  = half4(colorR.r, colorG.g, colorB.b, colorG.a);
    
    // Specular Highlight calculations
    vec2 lightDir = normalize(uLightPos - coord);
    vec2 normal = normalize(toCenter * vec2(1.5, 1.0));
    
    float spec = max(dot(normal, lightDir), 0.0);
    spec = pow(spec, 14.0) * uSpecularIntensity;
    
    // Sharp specular caustic gleam
    color.rgb += vec3(spec * 0.45);
    
    // Subtle physical glass rim lighting
    float edgeGlow = smoothstep(0.28, 0.5, dist) * 0.14;
    color.rgb += vec3(edgeGlow);
    
    return color;
  }
`;
