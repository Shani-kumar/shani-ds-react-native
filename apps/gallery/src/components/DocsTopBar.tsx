import { Box, HStack, VStack, Text, IconButton, useTheme } from '@shani/ui';
import { SegmentedOption } from './SegmentedOption';

export function DocsTopBar() {
  const { theme, mode, resolvedMode, setMode } = useTheme();

  return (
    <Box
      bg="surface"
      px="5"
      py="3"
      borderColor="subtle"
      borderWidth="hairline"
      shadow="sm"
      style={{
        width: '100%',
        borderBottomWidth: theme.borderWidth.thin,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        zIndex: 10,
      }}
    >
      <HStack justify="between" align="center" wrap={true} spacing="3" style={{ width: '100%' }}>
        <HStack spacing="3" align="center">
          <IconButton
            accessibilityLabel="Shani Design System Logo"
            name="Truck"
            variant="primary"
            size="sm"
            shape="square"
          />
          <VStack spacing="0">
            <HStack spacing="2" align="center">
              <Text variant="title">Shani DS</Text>
              <Text variant="caption" color="secondary" style={{ fontWeight: '500' }}>
                Documentation
              </Text>
            </HStack>
            <Text variant="caption" color="tertiary">
              React Native design system for logistics
            </Text>
          </VStack>
        </HStack>

        {/* Theme Switcher in Top Bar */}
        <HStack spacing="2" align="center" wrap={true}>
          <SegmentedOption
            label="Light"
            leftIcon="Sun"
            selected={mode === 'light'}
            onPress={() => setMode('light')}
          />
          <SegmentedOption
            label="Dark"
            leftIcon="Moon"
            selected={mode === 'dark'}
            onPress={() => setMode('dark')}
          />
          <SegmentedOption
            label={mode === 'system' ? `System (${resolvedMode === 'dark' ? 'Dark' : 'Light'})` : 'System'}
            leftIcon="Laptop"
            selected={mode === 'system'}
            onPress={() => setMode('system')}
          />
        </HStack>
      </HStack>
    </Box>
  );
}
