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

export interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
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
              <Text variant="body">{description}</Text>
            </VStack>
          </Card>

          {/* 1. Live Interactive Playground */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="heading">Live Interactive Playground</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="4">
                <Box
                  p="8"
                  bg="canvas"
                  borderRadius="md"
                  borderColor="subtle"
                  borderWidth="hairline"
                  style={{ alignItems: 'center', justifyContent: 'center', minHeight: 120 }}
                >
                  {playground}
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
              <Text variant="heading">All-States Matrix</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="4">{allStates}</VStack>
            </CardContent>
          </Card>

          {/* 3. Component Props API */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="heading">Component Props API</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="3">
                {propsData.map((prop) => (
                  <Card key={prop.name} variant="outlined" padding="sm">
                    <VStack spacing="1">
                      <HStack justify="between" align="center">
                        <HStack spacing="2" align="center">
                          <Text variant="label" style={{ fontWeight: '700' }}>
                            {prop.name}
                          </Text>
                          <Badge variant="neutral" size="sm">
                            {prop.type}
                          </Badge>
                        </HStack>
                        {prop.default ? (
                          <Text variant="caption">Default: {prop.default}</Text>
                        ) : null}
                      </HStack>
                      <Text variant="caption">{prop.description}</Text>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            </CardContent>
          </Card>

          {/* 4. Do's & Don'ts */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="heading">Do's & Don'ts</Text>
            </CardHeader>
            <CardContent>
              <HStack spacing="4" style={{ alignItems: 'flex-start' }} wrap={true}>
                {/* Do's */}
                <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 280 }}>
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
                <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 280 }}>
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
                <Text variant="heading">Accessibility & Assistive Tech</Text>
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
              <Text variant="heading">Copy-Paste Usage Snippet</Text>
            </CardHeader>
            <CardContent>
              <View
                style={{
                  backgroundColor: theme.colors.bg.canvas,
                  borderColor: theme.colors.border.subtle,
                  borderWidth: theme.borderWidth.hairline,
                  borderRadius: theme.radius.sm,
                  padding: theme.spacing[4],
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

