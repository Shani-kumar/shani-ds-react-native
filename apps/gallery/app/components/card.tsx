import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  type CardVariant,
  type CardPadding,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Card');

export default function CardPage() {
  const [variant, setVariant] = useState<CardVariant>('elevated');
  const [padding, setPadding] = useState<CardPadding>('md');

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <Box style={{ width: '100%' }}>
          <Card variant={variant} padding={padding}>
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>Waybill #840192</Text>
                <Badge variant="brand" size="sm" style={{ flexShrink: 0 }}>Priority Air</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="2">
                <Text variant="body">Consignee: Global Aero Logistics</Text>
                <Text variant="caption">Destination: Terminal 4, Gate B12</Text>
              </VStack>
            </CardContent>
            <CardFooter>
              <HStack justify="between" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
                <Text variant="caption">Weight: 42.0 kg</Text>
                <Button variant="secondary" size="sm">View Manifest</Button>
              </HStack>
            </CardFooter>
          </Card>
        </Box>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Variant:</Text>
            {(['outlined', 'elevated', 'filled'] as CardVariant[]).map((v) => (
              <SegmentedOption
                key={v}
                label={v}
                selected={variant === v}
                onPress={() => setVariant(v)}
              />
            ))}
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Padding:</Text>
            {(['none', 'sm', 'md', 'lg'] as CardPadding[]).map((p) => (
              <SegmentedOption
                key={p}
                label={p}
                selected={padding === p}
                onPress={() => setPadding(p)}
              />
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Outlined Card</Text>
          <Card variant="outlined" padding="md">
            <Text variant="body">Outlined: Subtle 1px border using border.subtle with transparent/surface background.</Text>
          </Card>
          <Text variant="label">Elevated Card</Text>
          <Card variant="elevated" padding="md">
            <Text variant="body">Elevated: Soft drop shadow using shadow.md token for card elevation and visual hierarchy.</Text>
          </Card>
          <Text variant="label">Filled Card</Text>
          <Card variant="filled" padding="md">
            <Text variant="body">Filled: Flat background container using bg.surfaceRaised without outer border.</Text>
          </Card>
        </VStack>
      }
      propsData={formatPropsForGallery(doc.props)}
      dos={doc.whenToUse}
      donts={doc.whenNotToUse}
      a11yNotes={doc.accessibilityNotes}
      codeSnippet={doc.example}
    />
  );
}

