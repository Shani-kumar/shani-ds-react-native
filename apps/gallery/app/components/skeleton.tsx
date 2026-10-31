import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  Skeleton,
  type SkeletonVariant,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function SkeletonPage() {
  const [variant, setVariant] = useState<SkeletonVariant>('rectangular');

  return (
    <ComponentPage
      title="Skeleton"
      description="Content placeholder primitive using Reanimated UI-thread pulse micro-interactions with automated static fallback for vestibular comfort."
      category="Display"
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
        <HStack spacing="2" align="center">
          {(['rectangular', 'text', 'circular'] as SkeletonVariant[]).map((v) => (
            <Button
              key={v}
              variant={variant === v ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setVariant(v)}
            >
              {v}
            </Button>
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
      propsData={[
        { name: 'variant', type: "'rectangular' | 'text' | 'circular'", default: "'rectangular'", description: 'Placeholder shape geometry.' },
        { name: 'width', type: 'number | string', default: "'100%'", description: 'Placeholder width in points or percentage.' },
        { name: 'height', type: 'number | string', default: 'undefined', description: 'Placeholder height in points.' },
        { name: 'borderRadius', type: 'keyof RadiusScale', default: 'undefined', description: 'Custom border radius override.' },
      ]}
      dos={[
        'Mirror the exact layout and dimensions of the incoming shipment cards to prevent cumulative layout shift (CLS).',
        'Use circular skeletons for driver avatars, text skeletons for waybill headers, and rectangular skeletons for map/signature cards.',
      ]}
      donts={[
        'Never flash skeletons for instantaneous (< 150ms) network cached responses.',
        'Never force pulse animations when users have reduced motion enabled in device settings.',
      ]}
      a11yNotes={[
        'Skeleton applies accessible={false} and accessibilityRole="none" so assistive screen readers do not announce repetitive empty placeholder shapes.',
        'Honors system reduced-motion settings automatically via Reanimated useReducedMotion().',
      ]}
      codeSnippet={`import { Skeleton, Card, HStack, VStack } from '@shani/ui';

export function WaybillCardSkeleton() {
  return (
    <Card variant="outlined" padding="md">
      <HStack spacing="3" align="center">
        <Skeleton variant="circular" width={44} height={44} />
        <VStack spacing="2" style={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="80%" height={12} />
        </VStack>
      </HStack>
    </Card>
  );
}`}
    />
  );
}
