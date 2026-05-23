/**
 * AGSL Refraction Shader for React Native Skia.
 * Simulates a thick liquid glass surface that refracts whatever is behind it,
 * adds dynamic surface wave distortion, and computes specular glares.
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
    
    // Create soft dynamic liquid ripples using high frequency sine/cosine math
    float waveX = sin(uv.y * 10.0 + uTime * 2.0) * cos(uv.x * 5.0 + uTime * 1.5);
    float waveY = cos(uv.x * 12.0 + uTime * 1.8) * sin(uv.y * 6.0 + uTime * 1.2);
    vec2 waveOffset = vec2(waveX, waveY) * uDistortionStrength;
    
    // Apply lens refraction: pull coordinates slightly towards the center (lens pinch)
    vec2 center = vec2(0.5, 0.5);
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    // Magnify toward edges (refraction bend)
    vec2 pinchOffset = toCenter * (dist * dist) * 0.08;
    
    // Combine wave distortion and physical pinch
    vec2 refractedCoord = (uv + waveOffset + pinchOffset) * resolution;
    
    // Sample the background backdrop image using refracted coordinates
    half4 color = image.eval(refractedCoord);
    
    // Specular Highlight calculations
    // Simulates a light source (uLightPos) reflecting off the dome of the liquid glass
    vec2 lightDir = normalize(uLightPos - coord);
    // Synthetic normal vector pointing outwards from the glass center
    vec2 normal = normalize(toCenter * vec2(1.5, 1.0));
    
    float spec = max(dot(normal, lightDir), 0.0);
    spec = pow(spec, 12.0) * uSpecularIntensity; // Sharp specular hot spot
    
    // Add specular highlight (pure white gleam)
    color.rgb += vec3(spec * 0.4);
    
    // Add subtle ambient rim lighting (edge glow)
    float edgeGlow = smoothstep(0.3, 0.5, dist) * 0.12;
    color.rgb += vec3(edgeGlow);
    
    return color;
  }
`;
