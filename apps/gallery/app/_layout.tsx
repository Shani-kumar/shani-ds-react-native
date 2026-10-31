import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions, Platform, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Box, useTheme } from '@shani/ui';
import { GalleryProvider } from '../src/context/GalleryContext';

function RootContent() {
  const { theme, resolvedMode } = useTheme();
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 768;

  if (isWideWeb) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg.canvas,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing[6],
          paddingHorizontal: theme.spacing[4],
        }}
      >
        <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
        {/* Responsive Phone Frame for Wide Screens */}
        <View
          style={{
            width: '100%',
            maxWidth: 480,
            height: '100%',
            maxHeight: 900,
            backgroundColor: theme.colors.bg.surface,
            borderRadius: theme.radius['2xl'],
            borderWidth: theme.borderWidth.thin,
            borderColor: theme.colors.border.subtle,
            overflow: 'hidden',
            elevation: theme.shadow.lg.elevation,
            shadowColor: theme.shadow.lg.shadowColor,
            shadowOffset: theme.shadow.lg.shadowOffset,
            shadowOpacity: theme.shadow.lg.shadowOpacity,
            shadowRadius: theme.shadow.lg.shadowRadius,
          }}
        >
          <Box flex={1} bg="canvas">
            <Slot />
          </Box>
        </View>
      </View>
    );
  }

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
      <GalleryProvider>
        <RootContent />
      </GalleryProvider>
    </SafeAreaProvider>
  );
}
