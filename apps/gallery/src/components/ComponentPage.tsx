import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Icon,
  useTheme,
} from '@shani/ui';
import { GalleryHeader } from './GalleryHeader';
import { SegmentedOption } from './SegmentedOption';

export interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
  example?: string;
}

export interface ComponentPageProps {
  title: string;
  description: string;
  category: 'Foundation' | 'Actions' | 'Forms' | 'Display';
  playground: React.ReactNode;
  playgroundControls?: React.ReactNode;
  allStates: React.ReactNode;
  propsData: PropItem[];
  dos: string[];
  donts: string[];
  a11yNotes: string[];
  codeSnippet: string;
}

export const ComponentPage = ({
  title,
  description,
  category,
  playground,
  playgroundControls,
  allStates,
  propsData,
  dos,
  donts,
  a11yNotes,
  codeSnippet,
}: ComponentPageProps) => {
  const { theme } = useTheme();
  type ViewportOption = 'fill' | 'tablet' | 'phone';
  const [previewViewport, setPreviewViewport] = useState<ViewportOption>('fill');

  const previewMaxWidth =
    previewViewport === 'phone' ? 390 : previewViewport === 'tablet' ? 768 : '100%';

  return (
    <Box flex={1} bg="canvas">
      <GalleryHeader title={`${title} Component`} showBack={true} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* Header Card */}
          <Card variant="elevated" padding="lg">
            <VStack spacing="2">
              <HStack spacing="2" align="center">
                <Text variant="heading">{title}</Text>
                <Badge variant="brand">{category}</Badge>
              </HStack>
              <Text variant="body" style={{ maxWidth: 720 }}>{description}</Text>
            </VStack>
          </Card>

          {/* 1. Live Interactive Playground */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title">Live Interactive Playground</Text>
                <HStack spacing="2" align="center" wrap={true}>
                  <Text variant="caption" color="secondary" style={{ marginRight: theme.spacing[1] }}>
                    Width:
                  </Text>
                  <SegmentedOption
                    label="Fill"
                    selected={previewViewport === 'fill'}
                    onPress={() => setPreviewViewport('fill')}
                  />
                  <SegmentedOption
                    label="Tablet (768)"
                    selected={previewViewport === 'tablet'}
                    onPress={() => setPreviewViewport('tablet')}
                  />
                  <SegmentedOption
                    label="Phone (390)"
                    selected={previewViewport === 'phone'}
                    onPress={() => setPreviewViewport('phone')}
                  />
                </HStack>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="4">
                <Box
                  style={{
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    p="6"
                    bg="canvas"
                    borderRadius="md"
                    borderColor="subtle"
                    borderWidth="hairline"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 120,
                      width: '100%',
                      maxWidth: previewMaxWidth,
                    }}
                  >
                    <Box style={{ width: '100%', alignItems: 'center' }}>
                      {playground}
                    </Box>
                  </Box>
                </Box>
                {playgroundControls ? (
                  <VStack spacing="3">
                    <Divider />
                    <Text variant="label">Playground Controls</Text>
                    {playgroundControls}
                  </VStack>
                ) : null}
              </VStack>
            </CardContent>
          </Card>

          {/* 2. All-States Matrix */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="title">All-States Matrix</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="4">{allStates}</VStack>
            </CardContent>
          </Card>

          {/* 3. Component Props API */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="title">Component Props API</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="3">
                {propsData.map((prop) => (
                  <Card key={prop.name} variant="outlined" padding="sm">
                    <VStack spacing="2">
                      <HStack justify="between" align="start" wrap={true} spacing="2">
                        <HStack
                          spacing="2"
                          align="center"
                          wrap={true}
                          style={{ flex: 1, minWidth: 0, maxWidth: '100%' }}
                        >
                          <Text variant="label" style={{ fontWeight: '700' }}>
                            {prop.name}
                          </Text>
                          <Badge variant="neutral" size="sm" style={{ flexShrink: 1, maxWidth: '100%' }}>
                            {prop.type}
                          </Badge>
                        </HStack>
                        {(() => {
                          const def = prop.default?.trim();
                          const isRequired = def === 'required' || def?.toLowerCase().includes('mandatory');
                          const isNone = !def || def === 'undefined';

                          if (isRequired) {
                            return (
                              <Badge variant="danger" size="sm" style={{ flexShrink: 0, marginTop: 2 }}>
                                Required
                              </Badge>
                            );
                          }

                          if (isNone) {
                            return (
                              <HStack spacing="1" align="center" style={{ flexShrink: 0, marginTop: 2 }}>
                                <Text variant="caption" color="secondary">
                                  Default: None
                                </Text>
                              </HStack>
                            );
                          }

                          return (
                            <HStack spacing="1" align="center" style={{ flexShrink: 0, marginTop: 2 }}>
                              <Text variant="caption" color="secondary">
                                Default:
                              </Text>
                              <Text
                                variant="caption"
                                style={{
                                  fontFamily: theme.typography.fontFamily.mono,
                                  fontWeight: '600',
                                }}
                              >
                                {def}
                              </Text>
                            </HStack>
                          );
                        })()}
                      </HStack>
                      <Text variant="caption" style={{ flexShrink: 1, minWidth: 0 }}>
                        {prop.description}
                      </Text>
                      {prop.example ? (
                        <Box
                          p="2"
                          bg="canvas"
                          borderRadius="sm"
                          borderColor="subtle"
                          borderWidth="hairline"
                          style={{ width: '100%' }}
                        >
                          <Text
                            variant="caption"
                            style={{
                              fontFamily: 'monospace',
                              color: theme.colors.text.secondary,
                            }}
                          >
                            {`Example: ${prop.example}`}
                          </Text>
                        </Box>
                      ) : null}
                    </VStack>
                  </Card>
                ))}
              </VStack>
            </CardContent>
          </Card>

          {/* 4. Do's & Don'ts */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="title">Do's & Don'ts</Text>
            </CardHeader>
            <CardContent>
              <HStack spacing="4" style={{ alignItems: 'flex-start' }} wrap={true}>
                {/* Do's */}
                <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
                  <VStack spacing="3">
                    <HStack spacing="2" align="center">
                      <Badge variant="success">DO</Badge>
                      <Text variant="title">Recommended Usage</Text>
                    </HStack>
                    <Divider />
                    {dos.map((item, index) => (
                      <HStack key={index} spacing="2" align="center">
                        <Icon name="Check" size="sm" color="success" />
                        <Text variant="caption" style={{ flex: 1 }}>{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Card>

                {/* Don'ts */}
                <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
                  <VStack spacing="3">
                    <HStack spacing="2" align="center">
                      <Badge variant="danger">DON'T</Badge>
                      <Text variant="title">Avoid These Patterns</Text>
                    </HStack>
                    <Divider />
                    {donts.map((item, index) => (
                      <HStack key={index} spacing="2" align="center">
                        <Icon name="X" size="sm" color="danger" />
                        <Text variant="caption" style={{ flex: 1 }}>{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Card>
              </HStack>
            </CardContent>
          </Card>

          {/* 5. Accessibility Notes */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack spacing="2" align="center">
                <Text variant="title">Accessibility & Assistive Tech</Text>
                <Badge variant="success">WCAG AA</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="2">
                {a11yNotes.map((note, index) => (
                  <HStack key={index} spacing="2" align="center">
                    <Icon name="Info" size="sm" color="brand" />
                    <Text variant="body" style={{ flex: 1 }}>{note}</Text>
                  </HStack>
                ))}
              </VStack>
            </CardContent>
          </Card>

          {/* 6. Copy-Paste Code Snippet */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="title">Copy-Paste Usage Snippet</Text>
            </CardHeader>
            <CardContent>
              <View
                style={{
                  backgroundColor: theme.colors.bg.canvas,
                  borderColor: theme.colors.border.subtle,
                  borderWidth: theme.borderWidth.hairline,
                  borderRadius: theme.radius.sm,
                  padding: theme.spacing[4],
                  maxWidth: '100%',
                  overflow: 'hidden',
                }}
              >
                <Text
                  variant="caption"
                  style={{
                    fontFamily: 'monospace',
                    color: theme.colors.text.secondary,
                    lineHeight: 20,
                  }}
                >
                  {codeSnippet}
                </Text>
              </View>
            </CardContent>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
};

