// liquidglass-rn Hyper-Real Apple Liquid Glass Engine

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  const copyInstallBtn = document.getElementById('copy-install-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const liveCodeSnippet = document.getElementById('live-code-snippet');

  // Simulator Elements
  const phoneScreen = document.getElementById('phone-screen');
  const simScrollArea = document.getElementById('sim-scroll-area');
  const previewNavbar = document.getElementById('preview-navbar');
  const liquidGlassCard = document.getElementById('interactive-card');
  const interactiveBtn = document.getElementById('interactive-btn');
  const simPlayBtn = document.getElementById('sim-play-btn');
  const simThemeToggle = document.getElementById('sim-theme-toggle');

  // Liquid Tab Bar
  const tabNavContainer = document.getElementById('tab-nav-container');
  const tabButtons = document.querySelectorAll('.liquid-tab-btn');
  const liquidPill = document.getElementById('liquid-pill');
  let currentTabIndex = 0;
  let isTabAnimating = false;
  let tabAnimationSpeed = 1.0;

  // Control Center Glass Slider
  const sliderTrack = document.getElementById('volume-slider-track');
  const sliderFill = document.getElementById('volume-slider-fill');
  const sliderValText = document.getElementById('volume-val');
  let isDraggingSlider = false;

  // Playground Controls
  const blurSlider = document.getElementById('blur-slider');
  const blurVal = document.getElementById('blur-val');
  const modeDarkBtn = document.getElementById('mode-dark');
  const modeLightBtn = document.getElementById('mode-light');
  const glowToggle = document.getElementById('glow-toggle');

  let currentBlur = 55;
  let isSimulatorDark = true;
  let isGlowEnabled = true;

  // 1. Site Theme Toggle
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    moonIcon.classList.toggle('hidden', !isDark);
    sunIcon.classList.toggle('hidden', isDark);
  });

  // 2. Simulator Theme Mode Toggle
  function setSimulatorTheme(dark) {
    isSimulatorDark = dark;
    if (dark) {
      phoneScreen.classList.remove('light');
      modeDarkBtn.className = 'py-2 px-3 rounded-xl bg-blue-600/30 border border-blue-500/50 text-xs font-semibold text-blue-200 transition';
      modeLightBtn.className = 'py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition';
    } else {
      phoneScreen.classList.add('light');
      modeLightBtn.className = 'py-2 px-3 rounded-xl bg-blue-600/30 border border-blue-500/50 text-xs font-semibold text-blue-200 transition';
      modeDarkBtn.className = 'py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition';
    }
    updateLiveCode();
  }

  modeDarkBtn.addEventListener('click', () => setSimulatorTheme(true));
  modeLightBtn.addEventListener('click', () => setSimulatorTheme(false));
  simThemeToggle.addEventListener('click', () => setSimulatorTheme(!isSimulatorDark));

  // 3. Real-time Caustic Light Reflection & Liquid Wave Ripple on LiquidCard
  liquidGlassCard.addEventListener('mousemove', (e) => {
    const rect = liquidGlassCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    liquidGlassCard.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    liquidGlassCard.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  liquidGlassCard.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    const rect = liquidGlassCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const wave = document.createElement('span');
    wave.className = 'liquid-wave-ripple';
    const size = Math.max(rect.width, rect.height) * 0.8;
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${x - size / 2}px`;
    wave.style.top = `${y - size / 2}px`;

    liquidGlassCard.appendChild(wave);
    setTimeout(() => wave.remove(), 750);
  });

  // 4. Elastic iOS Rubber-Banding Drag for LiquidCard
  let isCardDragging = false;
  let cardDragStartX = 0;
  let cardDragStartY = 0;
  let cardOffsetX = 0;
  let cardOffsetY = 0;

  liquidGlassCard.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    isCardDragging = true;
    cardDragStartX = e.clientX - cardOffsetX;
    cardDragStartY = e.clientY - cardOffsetY;
    liquidGlassCard.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isCardDragging) return;
    cardOffsetX = (e.clientX - cardDragStartX) * 0.42; // elastic resistance
    cardOffsetY = (e.clientY - cardDragStartY) * 0.42;
    liquidGlassCard.style.transform = `translate(${cardOffsetX}px, ${cardOffsetY}px) scale(0.98)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isCardDragging) return;
    isCardDragging = false;
    liquidGlassCard.style.cursor = 'grab';
    cardOffsetX = 0;
    cardOffsetY = 0;
    liquidGlassCard.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
    liquidGlassCard.style.transform = 'translate(0px, 0px) scale(1)';
    setTimeout(() => {
      liquidGlassCard.style.transition = '';
    }, 450);
  });

  // 5. Viscous Apple Liquid Tab Bar with Surface Tension Physics
  function setupLiquidTabBar() {
    function moveToTab(targetIndex) {
      if (isTabAnimating && targetIndex === currentTabIndex) return;
      isTabAnimating = true;

      const fromIndex = currentTabIndex;
      currentTabIndex = targetIndex;

      const containerRect = tabNavContainer.getBoundingClientRect();
      const currentTab = tabButtons[fromIndex];
      const targetTab = tabButtons[targetIndex];

      const currentRect = currentTab.getBoundingClientRect();
      const targetRect = targetTab.getBoundingClientRect();

      const startLeft = currentRect.left - containerRect.left;
      const startWidth = currentRect.width;
      const destLeft = targetRect.left - containerRect.left;
      const destWidth = targetRect.width;

      const isMovingRight = destLeft > startLeft;
      const distance = Math.abs(destLeft - startLeft);
      const baseDuration = (360 * (distance / (containerRect.width / 2) + 0.55)) / tabAnimationSpeed;
      const startTime = performance.now();

      tabButtons.forEach((btn, i) => {
        const icon = btn.querySelector('.tab-icon');
        if (i === targetIndex) {
          btn.classList.add('text-white');
          btn.classList.remove('text-zinc-400');
          if (icon) icon.style.transform = 'scale(1.1)';
        } else {
          btn.classList.remove('text-white');
          btn.classList.add('text-zinc-400');
          if (icon) icon.style.transform = 'scale(1.0)';
        }
      });

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / baseDuration);

        // Apple Fluid Curves: asymmetric velocity profile
        const leadingProgress = Math.min(1, Math.pow(progress, 0.68));
        const trailingProgress = Math.pow(progress, 1.48);

        let curLeft, curRight;
        if (isMovingRight) {
          curRight = (startLeft + startWidth) + ((destLeft + destWidth) - (startLeft + startWidth)) * leadingProgress;
          curLeft = startLeft + (destLeft - startLeft) * trailingProgress;
        } else {
          curLeft = startLeft + (destLeft - startLeft) * leadingProgress;
          curRight = (startLeft + startWidth) + ((destLeft + destWidth) - (startLeft + startWidth)) * trailingProgress;
        }

        const currentW = Math.max(destWidth * 0.9, curRight - curLeft);
        // Liquid surface tension: elongation causes vertical thinning
        const stretchRatio = currentW / destWidth;
        const scaleY = Math.max(0.80, Math.min(1.08, 1 - (stretchRatio - 1) * 0.38));

        liquidPill.style.left = `${curLeft}px`;
        liquidPill.style.width = `${currentW}px`;
        liquidPill.style.transform = `scaleY(${scaleY})`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          liquidPill.style.left = `${destLeft}px`;
          liquidPill.style.width = `${destWidth}px`;
          liquidPill.style.transform = 'scaleY(1)';
          isTabAnimating = false;
        }
      }

      requestAnimationFrame(animate);
    }

    function setInitialPill() {
      const containerRect = tabNavContainer.getBoundingClientRect();
      const firstTab = tabButtons[0];
      if (!firstTab) return;
      const rect = firstTab.getBoundingClientRect();
      liquidPill.style.left = `${rect.left - containerRect.left}px`;
      liquidPill.style.width = `${rect.width}px`;
      liquidPill.style.transform = 'scaleY(1)';
    }

    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => moveToTab(idx));
    });

    // Touch & Mouse Dragging across tabs
    let isDraggingTab = false;
    let tabContainerRect = null;

    tabNavContainer.addEventListener('mousedown', (e) => {
      isDraggingTab = true;
      tabContainerRect = tabNavContainer.getBoundingClientRect();
      handleTabDrag(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingTab) return;
      handleTabDrag(e);
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDraggingTab) return;
      isDraggingTab = false;
      const relX = e.clientX - tabContainerRect.left;
      const tabWidth = tabContainerRect.width / tabButtons.length;
      const closestIdx = Math.max(0, Math.min(tabButtons.length - 1, Math.floor(relX / tabWidth)));
      moveToTab(closestIdx);
    });

    function handleTabDrag(pointer) {
      if (!tabContainerRect) return;
      const curX = pointer.clientX - tabContainerRect.left;
      const pillW = tabContainerRect.width / tabButtons.length;
      const halfW = pillW / 2;
      const clampedCenter = Math.max(halfW, Math.min(tabContainerRect.width - halfW, curX));
      liquidPill.style.left = `${clampedCenter - halfW}px`;
      liquidPill.style.width = `${pillW * 1.15}px`;
      liquidPill.style.transform = `scaleY(0.84)`;
    }

    setTimeout(setInitialPill, 50);
    window.addEventListener('resize', setInitialPill);
  }

  setupLiquidTabBar();

  // 6. Interactive Control Center Glass Slider
  function updateSlider(e) {
    const rect = sliderTrack.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = Math.round((x / rect.width) * 100);
    sliderFill.style.width = `${pct}%`;
    sliderValText.textContent = `${pct}%`;
  }

  sliderTrack.addEventListener('mousedown', (e) => {
    isDraggingSlider = true;
    updateSlider(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingSlider) return;
    updateSlider(e);
  });

  window.addEventListener('mouseup', () => {
    isDraggingSlider = false;
  });

  // 7. Tactile LiquidButton (Ripple Origin from coordinates)
  interactiveBtn.addEventListener('click', (e) => {
    const rect = interactiveBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleLayer = interactiveBtn.querySelector('.ripple-layer');

    const ripple = document.createElement('span');
    ripple.className = 'liquid-ripple-drop';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    rippleLayer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  // 8. Music Play/Pause toggle
  let isPlaying = false;
  simPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPlaying = !isPlaying;
    simPlayBtn.textContent = isPlaying ? '⏸' : '▶';
  });

  // 9. Scroll-Linked Navbar
  simScrollArea.addEventListener('scroll', () => {
    const scrollY = simScrollArea.scrollTop;
    const maxOffset = 60;
    const opacity = Math.min(1, scrollY / maxOffset);
    const blur = 14 + opacity * 24;
    previewNavbar.style.backgroundColor = isSimulatorDark
      ? `rgba(18, 18, 22, ${0.25 + opacity * 0.65})`
      : `rgba(255, 255, 255, ${0.4 + opacity * 0.5})`;
    previewNavbar.style.backdropFilter = `blur(${blur}px) saturate(190%)`;
  });

  // 10. Blur Intensity Slider & Live Code Generator
  blurSlider.addEventListener('input', (e) => {
    currentBlur = e.target.value;
    blurVal.textContent = `${currentBlur}%`;

    document.querySelectorAll('.liquid-glass-card, .viscous-tab-capsule, .ios-glass-slider-track').forEach((el) => {
      el.style.backdropFilter = `blur(${Math.max(8, currentBlur * 0.55)}px) saturate(220%)`;
      el.style.webkitBackdropFilter = `blur(${Math.max(8, currentBlur * 0.55)}px) saturate(220%)`;
    });
    updateLiveCode();
  });

  // Glow Toggle
  glowToggle.addEventListener('change', (e) => {
    isGlowEnabled = e.target.checked;
    liquidGlassCard.style.boxShadow = isGlowEnabled
      ? '0 0 32px rgba(10, 132, 255, 0.35), 0 20px 48px -8px rgba(0, 0, 0, 0.6)'
      : '0 20px 48px -8px rgba(0, 0, 0, 0.6)';
    updateLiveCode();
  });

  function updateLiveCode() {
    liveCodeSnippet.textContent = `<LiquidCard
  stylePreset="ios"
  intensity={${currentBlur}}
  interactive={true}
  shadowDepth="medium"
  borderGlow={${isGlowEnabled}}
  borderRadius={30}
>
  <Text style={styles.title}>Midnight Refraction</Text>
  <LiquidButton
    variant="primary"
    title="Tactile Liquid Button"
    liquidRipple={true}
  />
</LiquidCard>`;
  }

  // 11. Copy Install and Code Buttons
  copyInstallBtn.addEventListener('click', () => {
    const cmd = 'npx expo install liquidglass-rn @shopify/react-native-skia expo-blur react-native-reanimated react-native-gesture-handler react-native-svg lucide-react-native';
    navigator.clipboard.writeText(cmd).then(() => {
      copyInstallBtn.textContent = 'Copied!';
      setTimeout(() => (copyInstallBtn.textContent = 'Copy'), 2000);
    });
  });

  copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(liveCodeSnippet.textContent).then(() => {
      copyCodeBtn.textContent = 'Copied!';
      setTimeout(() => (copyCodeBtn.textContent = 'Copy JSX'), 2000);
    });
  });
});
