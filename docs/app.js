// liquidglass-rn Apple Liquid Glass Engine & Simulator

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
  const interactiveCard = document.getElementById('interactive-card');
  const interactiveBtn = document.getElementById('interactive-btn');
  const simPlayBtn = document.getElementById('sim-play-btn');
  const simThemeToggle = document.getElementById('sim-theme-toggle');

  // Liquid Tab Bar Elements
  const tabNavContainer = document.getElementById('tab-nav-container');
  const tabButtons = document.querySelectorAll('.liquid-tab-btn');
  const liquidPill = document.getElementById('liquid-pill');
  let currentTabIndex = 0;
  let isTabAnimating = false;
  let tabAnimationSpeed = 1.0; // 1.0 = normal, 0.3 = slow motion

  // Speed controls
  const speedNormalBtn = document.getElementById('speed-normal');
  const speedSlowBtn = document.getElementById('speed-slow');

  // Overlays
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const previewModal = document.getElementById('preview-modal');
  const modalCard = document.getElementById('modal-card');

  const openSheetBtn = document.getElementById('open-sheet-btn');
  const closeSheetBtn = document.getElementById('close-sheet-btn');
  const previewSheet = document.getElementById('preview-sheet');

  // FAB
  const mainFabBtn = document.getElementById('main-fab-btn');
  const fabIcon = document.getElementById('fab-icon');
  const fabActions = document.getElementById('fab-actions');
  let isFabOpen = false;

  // Playground Controls
  const blurSlider = document.getElementById('blur-slider');
  const blurVal = document.getElementById('blur-val');
  const modeDarkBtn = document.getElementById('mode-dark');
  const modeLightBtn = document.getElementById('mode-light');
  const glowToggle = document.getElementById('glow-toggle');
  const tiltToggle = document.getElementById('tilt-toggle');

  let currentBlur = 55;
  let isSimulatorDark = true;
  let isTiltEnabled = true;
  let isGlowEnabled = true;

  // 1. Main Site Theme Toggle
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
      phoneScreen.classList.remove('bg-[#EAEBF0]', 'light');
      phoneScreen.classList.add('bg-[#0B0B0E]');
      modeDarkBtn.className = 'py-2 px-3 rounded-xl bg-purple-600/30 border border-purple-500/50 text-xs font-semibold text-purple-200 transition';
      modeLightBtn.className = 'py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition';
    } else {
      phoneScreen.classList.remove('bg-[#0B0B0E]');
      phoneScreen.classList.add('bg-[#EAEBF0]', 'light');
      modeLightBtn.className = 'py-2 px-3 rounded-xl bg-purple-600/30 border border-purple-500/50 text-xs font-semibold text-purple-200 transition';
      modeDarkBtn.className = 'py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition';
    }
    updateLiveCode();
  }

  modeDarkBtn.addEventListener('click', () => setSimulatorTheme(true));
  modeLightBtn.addEventListener('click', () => setSimulatorTheme(false));
  simThemeToggle.addEventListener('click', () => setSimulatorTheme(!isSimulatorDark));

  // 3. Apple Liquid Tab Bar Physics Engine (Asymmetric Fluid Stretch & Surface Tension Squash)
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

      // Duration scales with speed setting
      const baseDuration = (350 * (distance / (containerRect.width / 2) + 0.6)) / tabAnimationSpeed;
      const startTime = performance.now();

      // Deactivate icons
      tabButtons.forEach((btn, i) => {
        const icon = btn.querySelector('.tab-icon');
        const text = btn.querySelector('.tab-text');
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

        // Apple Fluid Spring Curves: Leading edge accelerates faster than trailing edge
        // Leading edge: fast cubic out
        const leadingProgress = Math.min(1, Math.pow(progress, 0.7));
        // Trailing edge: damped ease-in-out
        const trailingProgress = Math.pow(progress, 1.45);

        let curLeft, curRight;

        if (isMovingRight) {
          // Right edge stretches ahead rapidly
          curRight = (startLeft + startWidth) + ((destLeft + destWidth) - (startLeft + startWidth)) * leadingProgress;
          // Left edge lags behind
          curLeft = startLeft + (destLeft - startLeft) * trailingProgress;
        } else {
          // Left edge stretches ahead rapidly
          curLeft = startLeft + (destLeft - startLeft) * leadingProgress;
          // Right edge lags behind
          curRight = (startLeft + startWidth) + ((destLeft + destWidth) - (startLeft + startWidth)) * trailingProgress;
        }

        const currentW = Math.max(destWidth * 0.9, curRight - curLeft);

        // Liquid surface tension: elongation causes vertical thinning (squash)
        const stretchRatio = currentW / destWidth;
        const scaleY = Math.max(0.82, Math.min(1.08, 1 - (stretchRatio - 1) * 0.35));

        liquidPill.style.left = `${curLeft}px`;
        liquidPill.style.width = `${currentW}px`;
        liquidPill.style.transform = `scaleY(${scaleY})`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Snap bounce settle
          liquidPill.style.left = `${destLeft}px`;
          liquidPill.style.width = `${destWidth}px`;
          liquidPill.style.transform = 'scaleY(1)';
          isTabAnimating = false;
        }
      }

      requestAnimationFrame(animate);
    }

    // Set initial pill position
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

    setTimeout(setInitialPill, 50);
    window.addEventListener('resize', setInitialPill);
  }

  setupLiquidTabBar();

  // Speed switchers for inspecting the liquid stretch
  if (speedNormalBtn && speedSlowBtn) {
    speedNormalBtn.addEventListener('click', () => {
      tabAnimationSpeed = 1.0;
      speedNormalBtn.className = 'px-3 py-1 rounded-lg bg-purple-600 text-white font-semibold text-xs transition';
      speedSlowBtn.className = 'px-3 py-1 rounded-lg bg-white/10 text-zinc-300 text-xs hover:text-white transition';
    });

    speedSlowBtn.addEventListener('click', () => {
      tabAnimationSpeed = 0.25;
      speedSlowBtn.className = 'px-3 py-1 rounded-lg bg-purple-600 text-white font-semibold text-xs transition';
      speedNormalBtn.className = 'px-3 py-1 rounded-lg bg-white/10 text-zinc-300 text-xs hover:text-white transition';
    });
  }

  // 4. 3D Parallax Tilt for LiquidCard
  interactiveCard.addEventListener('mousemove', (e) => {
    if (!isTiltEnabled) return;
    const rect = interactiveCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    interactiveCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.985)`;
  });

  interactiveCard.addEventListener('mouseleave', () => {
    interactiveCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  tiltToggle.addEventListener('change', (e) => {
    isTiltEnabled = e.target.checked;
    if (!isTiltEnabled) {
      interactiveCard.style.transform = 'none';
    }
    updateLiveCode();
  });

  // 5. Tactile LiquidButton (Ripple Origin from coordinates)
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
    setTimeout(() => ripple.remove(), 700);
  });

  // 6. Music Play/Pause toggle
  let isPlaying = false;
  simPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPlaying = !isPlaying;
    simPlayBtn.textContent = isPlaying ? '⏸' : '▶';
  });

  // 7. Floating Action Button (FAB)
  mainFabBtn.addEventListener('click', () => {
    isFabOpen = !isFabOpen;
    if (isFabOpen) {
      fabIcon.style.transform = 'rotate(135deg)';
      fabActions.classList.remove('opacity-0', 'scale-75', 'pointer-events-none');
      fabActions.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    } else {
      fabIcon.style.transform = 'rotate(0deg)';
      fabActions.classList.add('opacity-0', 'scale-75', 'pointer-events-none');
      fabActions.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    }
  });

  // 8. Scroll-Linked Navbar
  simScrollArea.addEventListener('scroll', () => {
    const scrollY = simScrollArea.scrollTop;
    const maxOffset = 60;
    const opacity = Math.min(1, scrollY / maxOffset);
    const blur = 10 + opacity * 20;
    previewNavbar.style.backgroundColor = isSimulatorDark
      ? `rgba(18, 18, 22, ${0.25 + opacity * 0.65})`
      : `rgba(255, 255, 255, ${0.3 + opacity * 0.55})`;
    previewNavbar.style.backdropFilter = `blur(${blur}px)`;
  });

  // 9. Modal Overlays
  openModalBtn.addEventListener('click', () => {
    previewModal.classList.remove('opacity-0', 'pointer-events-none');
    previewModal.classList.add('opacity-100', 'pointer-events-auto');
    modalCard.classList.remove('scale-90');
    modalCard.classList.add('scale-100');
  });

  closeModalBtn.addEventListener('click', () => {
    modalCard.classList.remove('scale-100');
    modalCard.classList.add('scale-90');
    previewModal.classList.remove('opacity-100', 'pointer-events-auto');
    previewModal.classList.add('opacity-0', 'pointer-events-none');
  });

  // 10. Bottom Sheet Overlays
  openSheetBtn.addEventListener('click', () => {
    previewSheet.classList.remove('translate-y-full');
    previewSheet.classList.add('translate-y-0');
  });

  closeSheetBtn.addEventListener('click', () => {
    previewSheet.classList.remove('translate-y-0');
    previewSheet.classList.add('translate-y-full');
  });

  // 11. Blur Intensity Slider & Live Code Generator
  blurSlider.addEventListener('input', (e) => {
    currentBlur = e.target.value;
    blurVal.textContent = `${currentBlur}%`;

    document.querySelectorAll('.apple-glass, .liquid-tab-capsule').forEach((el) => {
      el.style.backdropFilter = `blur(${Math.max(6, currentBlur * 0.45)}px) saturate(190%)`;
      el.style.webkitBackdropFilter = `blur(${Math.max(6, currentBlur * 0.45)}px) saturate(190%)`;
    });
    updateLiveCode();
  });

  // Glow Toggle
  glowToggle.addEventListener('change', (e) => {
    isGlowEnabled = e.target.checked;
    interactiveCard.style.boxShadow = isGlowEnabled
      ? '0 0 28px rgba(191, 90, 242, 0.45), 0 20px 48px -12px rgba(0, 0, 0, 0.65)'
      : '0 20px 48px -12px rgba(0, 0, 0, 0.65)';
    updateLiveCode();
  });

  function updateLiveCode() {
    liveCodeSnippet.textContent = `<LiquidCard
  intensity={${currentBlur}}
  interactive={${isTiltEnabled}}
  shadowDepth="medium"
  borderGlow={${isGlowEnabled}}
  borderRadius={24}
>
  <Text>Midnight Refraction</Text>
  <LiquidButton
    variant="primary"
    title="Tap Liquid Ripple"
    liquidRipple={true}
  />
</LiquidCard>`;
  }

  // 12. Copy Install and Code Buttons
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
