import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Alert, Dimensions, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  LiquidThemeProvider,
  useTheme,
  LiquidNavbar,
  LiquidTabBar,
  LiquidCard,
  LiquidButton,
  LiquidFAB,
  LiquidModal,
  LiquidSheet,
  LiquidView,
} from './src/index';
import * as Icons from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function Dashboard() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  // Navigation active tab index
  const [activeTab, setActiveTab] = useState(0);

  // Scroll tracking shared value for scroll-linked Navbar blur
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // Modal / Drawer visibility states
  const [modalVisible, setModalVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Settings states
  const [useSkiaRefraction, setUseSkiaRefraction] = useState(false);
  const [blurStrength, setBlurStrength] = useState(50);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Ambient backdrop circles animated offsets
  const blob1X = useSharedValue(0);
  const blob1Y = useSharedValue(0);
  const blob2X = useSharedValue(0);
  const blob2Y = useSharedValue(0);

  // Animate ambient background blobs in slow organic orbits
  useEffect(() => {
    blob1X.value = withRepeat(
      withTiming(SCREEN_WIDTH * 0.4, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob1Y.value = withRepeat(
      withTiming(SCREEN_HEIGHT * 0.3, { duration: 14000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    blob2X.value = withRepeat(
      withTiming(-SCREEN_WIDTH * 0.3, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob2Y.value = withRepeat(
      withTiming(-SCREEN_HEIGHT * 0.2, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const blob1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1X.value }, { translateY: blob1Y.value }],
  }));

  const blob2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2X.value }, { translateY: blob2Y.value }],
  }));

  // Define tab navigation paths
  const tabRoutes = [
    { key: 'layouts', title: 'Widgets', icon: 'Layers' as const },
    { key: 'playground', title: 'Playground', icon: 'Sliders' as const },
    { key: 'overlays', title: 'Overlays', icon: 'Expand' as const },
  ];

  // FAB Bubble configurations
  const fabActions = [
    { icon: 'Sun' as const, label: 'Theme Toggle', onPress: toggleTheme },
    { icon: 'Info' as const, label: 'Info Info', onPress: () => setModalVisible(true) },
    { icon: 'Sliders' as const, label: 'Open Drawer', onPress: () => setSheetOpen(true) },
  ];

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      {/* 
        High-fidelity ambient glow backgrounds.
        These blobs drift behind the frosted glass to create a breathtaking
        glassmorphic depth.
      */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.ambientBlob, styles.cyanBlob, blob1Style]} />
        <Animated.View style={[styles.ambientBlob, styles.purpleBlob, blob2Style]} />
      </View>

      {/* Dynamic Scroll-Linked Top Navbar */}
      <LiquidNavbar
        title="LiquidRN Glass"
        scrollY={scrollY}
        leftComponent={<Icons.Sparkles size={22} color={theme.textColor} />}
        rightComponent={
          <Pressable onPress={toggleTheme}>
            {isDark ? (
              <Icons.Sun size={22} color={theme.textColor} />
            ) : (
              <Icons.Moon size={22} color={theme.textColor} />
            )}
          </Pressable>
        }
      />

      {/* Main Content Area */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 0 && (
          <View style={styles.tabContent}>
            {/* Intro Header */}
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>VisionOS Glass Widgets</Text>
            <Text style={[styles.sectionSubtext, { color: theme.subtextColor }]}>
              Tactile physical cards floating on soft backing lights.
            </Text>

            {/* Apple Music Player Widget */}
            <LiquidCard
              intensity={blurStrength}
              experimentalSkia={useSkiaRefraction}
              borderGlow={true}
              glowColor="rgba(255, 30, 100, 0.25)"
              shadowDepth="high"
              style={styles.widgetCard}
            >
              <View style={styles.musicRow}>
                {/* Vinyl Art Glass Dome */}
                <View style={styles.vinylContainer}>
                  <LiquidView
                    intensity={20}
                    style={styles.albumArt}
                    borderRadius={16}
                  >
                    <View style={[StyleSheet.absoluteFill, styles.albumGradient]}>
                      <Icons.Music size={32} color="#FFF" />
                    </View>
                  </LiquidView>
                </View>

                {/* Track Details */}
                <View style={styles.trackDetails}>
                  <Text numberOfLines={1} style={[styles.trackName, { color: theme.textColor }]}>
                    Midnight Refraction
                  </Text>
                  <Text numberOfLines={1} style={[styles.artistName, { color: theme.subtextColor }]}>
                    LiquidRN Skia Engine
                  </Text>
                </View>
              </View>

              {/* Scrub Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.accentColor }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={[styles.timeText, { color: theme.subtextColor }]}>1:24</Text>
                <Text style={[styles.timeText, { color: theme.subtextColor }]}>3:45</Text>
              </View>

              {/* Audio Controls */}
              <View style={styles.audioControls}>
                <LiquidButton variant="glass" scaleOnPress liquidRipple={false} style={styles.circleBtn}>
                  <Icons.SkipBack size={20} color={theme.textColor} />
                </LiquidButton>

                <LiquidButton
                  variant="primary"
                  glow={true}
                  scaleOnPress
                  liquidRipple={true}
                  style={[styles.circleBtn, styles.playBtn]}
                  onPress={() => setMusicPlaying(!musicPlaying)}
                >
                  {musicPlaying ? (
                    <Icons.Pause size={24} color="#FFF" />
                  ) : (
                    <Icons.Play size={24} color="#FFF" style={{ marginLeft: 4 }} />
                  )}
                </LiquidButton>

                <LiquidButton variant="glass" scaleOnPress liquidRipple={false} style={styles.circleBtn}>
                  <Icons.SkipForward size={20} color={theme.textColor} />
                </LiquidButton>
              </View>
            </LiquidCard>

            {/* Smart Home Hub Control Card */}
            <LiquidCard
              intensity={blurStrength}
              experimentalSkia={useSkiaRefraction}
              borderGlow={true}
              shadowDepth="medium"
              style={styles.widgetCard}
            >
              <Text style={[styles.cardTitle, { color: theme.textColor }]}>Smart Environment</Text>
              <Text style={[styles.cardSubtitle, { color: theme.subtextColor }]}>Living Room</Text>

              <View style={styles.gridRow}>
                {/* Temp Control */}
                <LiquidView intensity={30} style={styles.gridItem} borderRadius={16}>
                  <View style={styles.itemPadding}>
                    <Icons.Thermometer size={22} color={theme.accentColor} />
                    <Text style={[styles.gridMetric, { color: theme.textColor }]}>22.5°C</Text>
                    <Text style={[styles.gridLabel, { color: theme.subtextColor }]}>Temperature</Text>
                  </View>
                </LiquidView>

                {/* Humidity Control */}
                <LiquidView intensity={30} style={styles.gridItem} borderRadius={16}>
                  <View style={styles.itemPadding}>
                    <Icons.Droplets size={22} color="#00D2FF" />
                    <Text style={[styles.gridMetric, { color: theme.textColor }]}>48%</Text>
                    <Text style={[styles.gridLabel, { color: theme.subtextColor }]}>Humidity</Text>
                  </View>
                </LiquidView>
              </View>

              {/* Glossy trigger button */}
              <LiquidButton
                variant="secondary"
                title="Refresh Analytics"
                style={styles.widgetBtn}
                onPress={() => Alert.alert('Hub Trigger', 'Refreshing climate stats...')}
              />
            </LiquidCard>
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Interactive Playground</Text>
            <Text style={[styles.sectionSubtext, { color: theme.subtextColor }]}>
              Customize glass effects and toggle high-performance shader warps.
            </Text>

            {/* Settings Card */}
            <LiquidCard intensity={blurStrength} style={styles.playgroundCard}>
              {/* Theme Toggle option */}
              <View style={styles.optionRow}>
                <View>
                  <Text style={[styles.optionTitle, { color: theme.textColor }]}>Dark Mode Theme</Text>
                  <Text style={[styles.optionDesc, { color: theme.subtextColor }]}>
                    Switch between dark obsidian and sleek light modes.
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: theme.accentColor }}
                  thumbColor="#f4f3f4"
                />
              </View>

              {/* Skia Shader Option */}
              <View style={styles.optionRow}>
                <View style={styles.optionTextColumn}>
                  <Text style={[styles.optionTitle, { color: theme.textColor }]}>GPU Refraction Shaders</Text>
                  <Text style={[styles.optionDesc, { color: theme.subtextColor }]}>
                    Use Skia runtime shaders for dynamic background refraction.
                  </Text>
                </View>
                <Switch
                  value={useSkiaRefraction}
                  onValueChange={setUseSkiaRefraction}
                  trackColor={{ false: '#767577', true: theme.accentColor }}
                  thumbColor="#f4f3f4"
                />
              </View>

              {/* Blur Intensity custom description */}
              <View style={styles.sliderInfoRow}>
                <Text style={[styles.optionTitle, { color: theme.textColor }]}>Blur Intensity</Text>
                <Text style={[styles.optionMetric, { color: theme.accentColor }]}>{blurStrength}%</Text>
              </View>
              <Text style={[styles.optionDesc, { color: theme.subtextColor, marginBottom: 12 }]}>
                Adjust the opacity and frosting density of the glass layout.
              </Text>
              
              {/* Custom Sliders fallback triggers */}
              <View style={styles.sliderBtnRow}>
                <LiquidButton
                  variant="glass"
                  title="Low (20)"
                  style={styles.sliderBtn}
                  onPress={() => setBlurStrength(20)}
                />
                <LiquidButton
                  variant="glass"
                  title="Medium (50)"
                  style={styles.sliderBtn}
                  onPress={() => setBlurStrength(50)}
                />
                <LiquidButton
                  variant="glass"
                  title="High (85)"
                  style={styles.sliderBtn}
                  onPress={() => setBlurStrength(85)}
                />
              </View>
            </LiquidCard>

            {/* Tactile Buttons Gallery */}
            <Text style={[styles.sectionTitle, { color: theme.textColor, marginTop: 10 }]}>Tactile Button Variants</Text>
            <View style={styles.btnGallery}>
              <LiquidButton
                variant="primary"
                title="Accent Solid Ripple"
                glow={true}
                style={styles.galleryBtn}
                onPress={() => {}}
              />
              <LiquidButton
                variant="secondary"
                title="Secondary Dynamic Glass"
                style={styles.galleryBtn}
                onPress={() => {}}
              />
              <LiquidButton
                variant="glass"
                title="Pure VisionOS Glass"
                style={styles.galleryBtn}
                onPress={() => {}}
              />
            </View>
          </View>
        )}

        {activeTab === 2 && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Overlays & Drag Gestures</Text>
            <Text style={[styles.sectionSubtext, { color: theme.subtextColor }]}>
              Overlay modal overlays and bottom drawers using gesture spring controllers.
            </Text>

            {/* Launchers */}
            <LiquidCard intensity={blurStrength} style={styles.overlayCard}>
              <Icons.Layers size={40} color={theme.accentColor} style={styles.overlayIcon} />
              <Text style={[styles.cardTitle, { color: theme.textColor, textAlign: 'center' }]}>
                Immersive Overlays
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.subtextColor, textAlign: 'center', marginBottom: 20 }]}>
                Overlay popup boxes and sheets with smooth spring damping physics.
              </Text>

              <LiquidButton
                variant="primary"
                title="Launch Centered Modal"
                glow={true}
                style={styles.overlayBtn}
                onPress={() => setModalVisible(true)}
              />

              <LiquidButton
                variant="glass"
                title="Swipe Up bottom Drawer"
                style={styles.overlayBtn}
                onPress={() => setSheetOpen(true)}
              />
            </LiquidCard>
          </View>
        )}
        
        {/* Spacer at bottom to prevent floating bar overlapping layout */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Immersive centered Glass Modal */}
      <LiquidModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        experimentalSkia={useSkiaRefraction}
      >
        <Icons.Sparkles size={36} color={theme.accentColor} style={styles.modalIcon} />
        <Text style={[styles.modalTitle, { color: theme.textColor }]}>Liquid Glass UI</Text>
        <Text style={[styles.modalDesc, { color: theme.subtextColor }]}>
          This centered glass card uses VisionOS spring physics on arrival. Tap below to dismiss.
        </Text>
        <LiquidButton
          variant="primary"
          title="Dismiss Modal"
          style={styles.modalDismissBtn}
          onPress={() => setModalVisible(false)}
        />
      </LiquidModal>

      {/* Gesture Bottom Drawer */}
      <LiquidSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text style={[styles.sheetTitle, { color: theme.textColor }]}>Tactile Bottom Drawer</Text>
        <Text style={[styles.sheetDesc, { color: theme.subtextColor }]}>
          Drag down on the handle or the sheet body to organically close the panel using spring bounds.
        </Text>
        
        {/* Dynamic mini-control hub in drawer */}
        <View style={styles.drawerHub}>
          <LiquidCard intensity={30} style={styles.drawerHubCard}>
            <View style={styles.musicRow}>
              <Icons.ShieldCheck size={26} color={theme.accentColor} />
              <View style={styles.trackDetails}>
                <Text style={[styles.gridMetric, { color: theme.textColor, fontSize: 15 }]}>Liquid Engine Secured</Text>
                <Text style={[styles.gridLabel, { color: theme.subtextColor }]}>60FPS native threads</Text>
              </View>
            </View>
          </LiquidCard>
        </View>

        <LiquidButton
          variant="secondary"
          title="Close Drawer"
          style={styles.sheetCloseBtn}
          onPress={() => setSheetOpen(false)}
        />
      </LiquidSheet>

      {/* Floating Action Menu (Skia liquid morph separation) */}
      <LiquidFAB actions={fabActions} icon="Plus" />

      {/* Floating Bottom Glass Tab Bar */}
      <View style={styles.tabBarWrapper}>
        <LiquidTabBar
          routes={tabRoutes}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <LiquidThemeProvider defaultMode="dark">
        <Dashboard />
      </LiquidThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  ambientBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    filter: 'blur(60px)', // Standard CSS native blur fallback
    opacity: 0.45,
  },
  cyanBlob: {
    backgroundColor: '#00D2FF',
    top: '15%',
    left: '10%',
  },
  purpleBlob: {
    backgroundColor: '#BF5AF2',
    bottom: '25%',
    right: '10%',
  },
  scrollContent: {
    paddingTop: 100, // Safe padding below header navbar
    paddingBottom: 110, // Prevent overlapping tabbar
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 15,
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 20,
    lineHeight: 18,
  },
  widgetCard: {
    width: '100%',
    marginBottom: 20,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vinylContainer: {
    width: 56,
    height: 56,
    marginRight: 16,
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  albumGradient: {
    backgroundColor: '#FF1E64',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  trackDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  trackName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  artistName: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    width: '38%',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
  },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 0.48,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  itemPadding: {
    padding: 16,
  },
  gridMetric: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 2,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  widgetBtn: {
    width: '100%',
  },
  playgroundCard: {
    width: '100%',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  optionTextColumn: {
    flex: 0.85,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  },
  sliderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 4,
  },
  optionMetric: {
    fontSize: 15,
    fontWeight: '700',
  },
  sliderBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderBtn: {
    flex: 0.31,
  },
  btnGallery: {
    width: '100%',
  },
  galleryBtn: {
    width: '100%',
    marginBottom: 12,
  },
  overlayCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
  },
  overlayIcon: {
    marginBottom: 14,
  },
  overlayBtn: {
    width: '100%',
    marginBottom: 14,
  },
  bottomSpacer: {
    height: 40,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 90,
  },
  modalIcon: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalDismissBtn: {
    width: '100%',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  sheetDesc: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 20,
  },
  drawerHub: {
    width: '100%',
    marginBottom: 24,
  },
  drawerHubCard: {
    width: '100%',
  },
  sheetCloseBtn: {
    width: '100%',
  },
});
