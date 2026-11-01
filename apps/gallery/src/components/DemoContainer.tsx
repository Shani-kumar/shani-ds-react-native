import React, { useState } from 'react';
import { View } from 'react-native';
import { Box, VStack, HStack, Text, Button, Icon, useTheme, useBreakpoint } from '@shani/ui';

interface DemoContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DemoContainer({ title, subtitle, children }: DemoContainerProps) {
  const { theme } = useTheme();
  const { isTabletOrLarger } = useBreakpoint();
  const [viewMode, setViewMode] = useState<'phone' | 'fill'>('phone');

  // Below 600px (phones, Expo Go): full width, no frame, normal mobile layout
  if (!isTabletOrLarger) {
    return (
      <Box flex={1} bg="canvas">
        {children}
      </Box>
    );
  }

  // 600px and above: top control toolbar + centered phone frame (or full width)
  return (
    <Box flex={1} bg="canvas" p="6">
      <VStack spacing="4" style={{ width: '100%', maxWidth: 960, alignSelf: 'center' }}>
        {/* Viewport Control Bar */}
        <Box
          bg="surface"
          p="4"
          borderRadius="lg"
          borderColor="subtle"
          borderWidth="hairline"
          shadow="sm"
        >
          <HStack justify="between" align="center" wrap={true} spacing="3">
            <VStack spacing="0" style={{ flex: 1, minWidth: 160 }}>
              <HStack spacing="2" align="center">
                <Icon name="Smartphone" size="sm" color="brand" />
                <Text variant="title">{title}</Text>
              </HStack>
              {subtitle ? <Text variant="caption">{subtitle}</Text> : null}
            </VStack>

            <HStack spacing="1" align="center" wrap={true}>
              <Text variant="caption" color="secondary" style={{ marginRight: theme.spacing[1] }}>
                Viewport:
              </Text>
              <Button
                variant={viewMode === 'phone' ? 'primary' : 'ghost'}
                size="sm"
                leftIcon="Smartphone"
                onPress={() => setViewMode('phone')}
              >
                Phone (390)
              </Button>
              <Button
                variant={viewMode === 'fill' ? 'primary' : 'ghost'}
                size="sm"
                leftIcon="Maximize2"
                onPress={() => setViewMode('fill')}
              >
                Full Width
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Demo Content Container */}
        {viewMode === 'phone' ? (
          <View
            style={{
              width: '100%',
              maxWidth: 390,
              height: 844,
              alignSelf: 'center',
              backgroundColor: theme.colors.bg.canvas,
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
            {children}
          </View>
        ) : (
          <Box
            style={{
              width: '100%',
              backgroundColor: theme.colors.bg.canvas,
              borderRadius: theme.radius.lg,
              borderWidth: theme.borderWidth.thin,
              borderColor: theme.colors.border.subtle,
              overflow: 'hidden',
            }}
          >
            {children}
          </Box>
        )}
      </VStack>
    </Box>
  );
}
