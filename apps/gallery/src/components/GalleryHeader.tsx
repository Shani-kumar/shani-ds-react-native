import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Badge,
  Divider,
  useTheme,
} from '@shani/ui';
import { useGallery } from '../context/GalleryContext';

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
  const { brand, setBrand } = useGallery();

  return (
    <Box bg="surface" px="4" py="3" borderColor="subtle" borderWidth="hairline" shadow="sm">
      <VStack spacing="3">
        {/* Top Row: Navigation, Title & Active Brand */}
        <HStack justify="between" align="center">
          <HStack spacing="3" align="center" style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
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

          <Badge variant={brand === 'apex' ? 'warning' : 'brand'} size="sm">
            {brand === 'apex' ? 'Apex Fleet' : 'Shani Core'}
          </Badge>
        </HStack>

        {/* Bottom Row: Theme & Brand Switchers (Scrollable without clipping) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '100%',
          }}
        >
          <HStack spacing="2" align="center">
            {/* Mode Switcher */}
            <HStack spacing="1" align="center">
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
                {mode === 'system' ? `Auto (${resolvedMode})` : 'System'}
              </Button>
            </HStack>

            <Divider orientation="vertical" />

            {/* Brand Switcher */}
            <HStack spacing="1" align="center">
              <Button
                variant={brand === 'shani' ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setBrand('shani')}
              >
                Shani
              </Button>
              <Button
                variant={brand === 'apex' ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setBrand('apex')}
              >
                Apex
              </Button>
            </HStack>
          </HStack>
        </ScrollView>
      </VStack>
    </Box>
  );
};
