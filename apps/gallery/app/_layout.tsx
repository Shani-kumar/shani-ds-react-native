import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Box, useTheme, ThemeProvider, useBreakpoint } from '@shani/ui';
import { DocsSidebar } from '../src/components/DocsSidebar';
import { DocsTopBar } from '../src/components/DocsTopBar';

function RootContent() {
  const { theme, resolvedMode } = useTheme();
  const { isTabletOrLarger } = useBreakpoint();

  // 600px and above: documentation layout with left sidebar, top bar with theme switcher, and 960px max content
  if (isTabletOrLarger) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg.canvas, height: '100%' }}>
        <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
        <DocsTopBar />
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: '100%', overflow: 'hidden' }}>
          <DocsSidebar />
          <View style={{ flex: 1, backgroundColor: theme.colors.bg.canvas, height: '100%' }}>
            <View style={{ flex: 1, width: '100%', maxWidth: 960, alignSelf: 'center' }}>
              <Slot />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Below 600px (phones, Expo Go): full width, no frame, normal mobile layout
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg.canvas }}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <Box flex={1} bg="canvas">
        <Slot />
      </Box>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialMode="light">
        <RootContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
