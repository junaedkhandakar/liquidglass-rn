// liquidglass-rn Web Preview Application

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

  // Tab Bar
  const tabItems = document.querySelectorAll('.tab-item');
  const liquidTabBubble = document.getElementById('liquid-tab-bubble');
  let activeTabIndex = 0;

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

  // 1. Theme Toggle (Main Site)
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
      phoneScreen.classList.remove('bg-zinc-200');
      phoneScreen.classList.add('bg-[#0B0B0E]');
      phoneScreen.classList.remove('light');
      modeDarkBtn.className = 'py-2 px-3 rounded-xl bg-purple-600/30 border border-purple-500/50 text-xs font-semibold text-purple-200 transition';
      modeLightBtn.className = 'py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition';
    } else {
      phoneScreen.classList.remove('bg-[#0B0B0E]');
      phoneScreen.classList.add('bg-zinc-200');
      phoneScreen.classList.add('light');
      modeLightBtn.className = 'py-2 px-3 rounded-xl bg-purple-600/30 border border-purple-500/50 text-xs font-semibold text-purple-200 transition';
      modeDarkBtn.className = 'py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition';
    }
    updateLiveCode();
  }

  modeDarkBtn.addEventListener('click', () => setSimulatorTheme(true));
  modeLightBtn.addEventListener('click', () => setSimulatorTheme(false));
  simThemeToggle.addEventListener('click', () => setSimulatorTheme(!isSimulatorDark));

  // 3. 3D Parallax Tilt for LiquidCard
  interactiveCard.addEventListener('mousemove', (e) => {
    if (!isTiltEnabled) return;
    const rect = interactiveCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    interactiveCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.985)`;
  });

  interactiveCard.addEventListener('mouseleave', () => {
    interactiveCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  tiltToggle.addEventListener('change', (e) => {
    isTiltEnabled = e.target.checked;
    if (!isTiltEnabled) {
      interactiveCard.style.transform = 'none';
    }
    updateLiveCode();
  });

  // 4. Tactile LiquidButton (Ripple Origin from coordinates)
  interactiveBtn.addEventListener('click', (e) => {
    const rect = interactiveBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleLayer = interactiveBtn.querySelector('.ripple-layer');

    const ripple = document.createElement('span');
    ripple.className = 'ripple-circle';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    rippleLayer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  // 5. Music Play/Pause toggle
  let isPlaying = false;
  simPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPlaying = !isPlaying;
    simPlayBtn.textContent = isPlaying ? '⏸' : '▶';
  });

  // 6. Asymmetric Liquid Tab Bar
  function updateTabIndicator(index) {
    activeTabIndex = index;
    const activeTab = tabItems[index];
    const totalTabs = tabItems.length;
    const percentWidth = 100 / totalTabs;
    const leftOffset = index * percentWidth;

    // Simulate asymmetric liquid stretch & squash
    liquidTabBubble.style.width = `${percentWidth - 1}%`;
    liquidTabBubble.style.left = `${leftOffset + 0.5}%`;

    tabItems.forEach((tab, i) => {
      tab.classList.toggle('text-white', i === index);
      tab.classList.toggle('text-zinc-400', i !== index);
    });
  }

  tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => updateTabIndicator(index));
  });
  updateTabIndicator(0);

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
    const blur = 8 + opacity * 16;
    previewNavbar.style.backgroundColor = `rgba(20, 20, 25, ${0.2 + opacity * 0.6})`;
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

    // Apply live blur to glass surfaces in simulator
    document.querySelectorAll('.glass-surface').forEach((el) => {
      el.style.backdropFilter = `blur(${Math.max(4, currentBlur * 0.4)}px)`;
      el.style.webkitBackdropFilter = `blur(${Math.max(4, currentBlur * 0.4)}px)`;
    });
    updateLiveCode();
  });

  // Glow Toggle
  glowToggle.addEventListener('change', (e) => {
    isGlowEnabled = e.target.checked;
    interactiveCard.style.boxShadow = isGlowEnabled
      ? '0 0 25px rgba(191, 90, 242, 0.4), 0 8px 32px rgba(0, 0, 0, 0.45)'
      : '0 8px 32px rgba(0, 0, 0, 0.45)';
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
