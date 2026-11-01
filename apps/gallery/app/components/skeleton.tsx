import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Skeleton,
  type SkeletonVariant,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Skeleton');

export default function SkeletonPage() {
  const [variant, setVariant] = useState<SkeletonVariant>('rectangular');

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <VStack spacing="2" align="center">
          <Skeleton
            variant={variant}
            width={variant === 'circular' ? 64 : 260}
            height={variant === 'circular' ? 64 : variant === 'text' ? 20 : 80}
          />
          <Text variant="caption">
            Active Variant: {variant}
          </Text>
        </VStack>
      }
      playgroundControls={
        <HStack spacing="2" align="center" wrap={true}>
          {(['rectangular', 'text', 'circular'] as SkeletonVariant[]).map((v) => (
            <SegmentedOption
              key={v}
              label={v}
              selected={variant === v}
              onPress={() => setVariant(v)}
            />
          ))}
        </HStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Simulated Waybill Card Loading Skeleton</Text>
          <Card variant="outlined" padding="md">
            <HStack spacing="3" align="center">
              <Skeleton variant="circular" width={48} height={48} />
              <VStack spacing="2" style={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="90%" height={14} />
              </VStack>
            </HStack>
            <Box mt="4">
              <Skeleton variant="rectangular" width="100%" height={70} />
            </Box>
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
