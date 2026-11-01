import { useRouter } from 'expo-router';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  useTheme,
  useBreakpoint,
} from '@shani/ui';

interface GalleryHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export const GalleryHeader = ({
  title = 'Shani DS Gallery',
  subtitle,
  showBack = false,
}: GalleryHeaderProps) => {
  const router = useRouter();
  const { mode, resolvedMode, setMode } = useTheme();
  const { isTabletOrLarger } = useBreakpoint();

  // On desktop / tablet (600px+), DocsTopBar and DocsSidebar handle global layout & theming
  if (isTabletOrLarger) {
    return null;
  }

  return (
    <Box bg="surface" px="4" py="3" borderColor="subtle" borderWidth="hairline" shadow="sm">
      <VStack spacing="2">
        {/* Top Row: Navigation / Logo + Title */}
        <HStack spacing="3" align="center" style={{ width: '100%' }}>
          {showBack ? (
            <IconButton
              accessibilityLabel="Go back to home"
              name="ArrowLeft"
              variant="ghost"
              size="sm"
              onPress={() => router.push('/')}
            />
          ) : (
            <IconButton
              accessibilityLabel="Logistics DS Logo"
              name="Truck"
              variant="primary"
              size="sm"
              shape="square"
            />
          )}
          <VStack spacing="0" style={{ flex: 1, minWidth: 0 }}>
            <Text variant="title" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text variant="caption" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </VStack>
        </HStack>

        {/* Bottom Row: Theme Switcher Only (Light / Dark / System) */}
        <HStack spacing="1" align="center" wrap={true} style={{ width: '100%' }}>
          <Button
            variant={mode === 'light' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon="Sun"
            onPress={() => setMode('light')}
          >
            Light
          </Button>
          <Button
            variant={mode === 'dark' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon="Moon"
            onPress={() => setMode('dark')}
          >
            Dark
          </Button>
          <Button
            variant={mode === 'system' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon="Laptop"
            onPress={() => setMode('system')}
          >
            {mode === 'system' ? `System (${resolvedMode === 'dark' ? 'Dark' : 'Light'})` : 'System'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
