import { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Card,
  Timeline,
  type TimelineStep,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';

export default function TimelinePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  const baseSteps: Omit<TimelineStep, 'state'>[] = [
    {
      id: 'step-1',
      title: 'Order Placed & Label Created',
      timestamp: '08:15 AM',
      description: 'Billing verified and tracking barcode assigned at shipping dock',
    },
    {
      id: 'step-2',
      title: 'Sorted at Regional Fulfillment Hub',
      timestamp: '11:45 AM',
      description: 'Scanned through automated cross-belt sorting system (Chute 14)',
    },
    {
      id: 'step-3',
      title: 'Out for Courier Delivery',
      timestamp: '02:30 PM',
      description: 'Loaded onto Delivery Van #14 - Estimated arrival 04:15 PM',
    },
    {
      id: 'step-4',
      title: 'Package Delivered',
      timestamp: 'Expected 04:15 PM',
      description: 'Recipient signature or contactless front-door drop confirmation',
    },
  ];

  const steps: TimelineStep[] = baseSteps.map((step, idx) => {
    let state: TimelineStep['state'] = 'upcoming';
    if (idx < currentStepIndex) {
      state = 'completed';
    } else if (idx === currentStepIndex) {
      state = 'current';
    }
    return { ...step, state };
  });

  return (
    <ComponentPage
      title="Timeline"
      description="Vertical milestone stepper for courier deliveries and logistics tracking waybills with accessible list semantics and active focus rings."
      category="Display"
      playground={
        <Card variant="outlined" padding="md" style={{ width: '100%' }}>
          <Timeline steps={steps} />
        </Card>
      }
      playgroundControls={
        <HStack spacing="2" align="center" wrap={true}>
          <Text variant="caption">Simulate Progress:</Text>
          {baseSteps.map((_, idx) => (
            <SegmentedOption
              key={idx}
              label={`Step ${idx + 1}`}
              selected={currentStepIndex === idx}
              onPress={() => setCurrentStepIndex(idx)}
            />
          ))}
        </HStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Timeline Step States</Text>
          <Card variant="outlined" padding="md">
            <Timeline
              steps={[
                {
                  id: 's1',
                  title: 'Completed State',
                  state: 'completed',
                  timestamp: '10:00 AM',
                  description: 'Green circle with Check icon; solid connecting line below',
                },
                {
                  id: 's2',
                  title: 'Current State',
                  state: 'current',
                  timestamp: '11:30 AM',
                  description: 'Active pulsating brand focus dot with highlighted title',
                },
                {
                  id: 's3',
                  title: 'Upcoming State',
                  state: 'upcoming',
                  timestamp: 'Pending',
                  description: 'Subtle ring border with secondary text color',
                },
              ]}
            />
          </Card>
        </VStack>
      }
      propsData={[
        {
          name: 'steps',
          type: 'TimelineStep[]',
          default: 'required',
          description: 'Array of sequential logistics milestone objects rendered as a vertical progress stepper.',
          example: 'steps={trackingSteps}',
        },
        {
          name: 'steps[].id',
          type: 'string',
          default: 'required',
          description: 'Unique key identifier for the step.',
          example: 'id="step-1"',
        },
        {
          name: 'steps[].state',
          type: "'completed' | 'current' | 'upcoming'",
          default: 'required',
          description: 'Milestone progress state driving indicator colors, icon glyphs, and connecting line tokens.',
          example: 'state="current"',
        },
        {
          name: 'steps[].title',
          type: 'string',
          default: 'required',
          description: 'Milestone title. Rendered as title variant for current step, and label for completed/upcoming.',
          example: 'title="Out for Courier Delivery"',
        },
        {
          name: 'steps[].timestamp',
          type: 'string',
          default: 'None',
          description: 'Completion time or estimated arrival timestamp. Automatically wraps below title when space is tight.',
          example: 'timestamp="02:15 PM • Oct 31"',
        },
        {
          name: 'steps[].description',
          type: 'string',
          default: 'None',
          description: 'Detailed depot, manifest, or transit notes rendered in caption text below title.',
          example: 'description="Courier has departed the facility with 12 stops remaining"',
        },
        {
          name: 'steps[].icon',
          type: 'Lucide icon component or React element',
          default: 'None',
          description: 'Optional custom icon component overriding the default checkmark/focus dot.',
          example: 'icon={Truck}',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout constraints only (margin, width). Line widths, indicator geometry, and text styles are token-governed.',
          example: "style={{ width: '100%' }}",
        },
      ]}
      dos={[
        'Use Timeline to structure sequential logistics workflows (e.g. pickup -> sort -> transit -> delivery).',
        'Mark exactly one active in-progress milestone as state="current".',
        'Provide timestamps to reassure customers about delivery recency.',
      ]}
      donts={[
        'Never use Timeline for non-chronological or parallel tasks.',
        'Never skip milestone steps without marking preceding steps completed.',
      ]}
      a11yNotes={[
        'Timeline applies accessibilityRole="list" and marks each item with spoken step numbers (e.g. "Step 2 of 4, current: Sorted at Hub").',
        'Ensures users of assistive technologies understand exactly where an order is along its transit route.',
      ]}
      codeSnippet={`import { Timeline, type TimelineStep } from '@shani/ui';

const shipmentSteps: TimelineStep[] = [
  { id: '1', title: 'Pickup Completed', state: 'completed', timestamp: '09:00 AM' },
  { id: '2', title: 'In Transit', state: 'current', timestamp: '11:15 AM' },
  { id: '3', title: 'Delivered', state: 'upcoming' },
];

export function OrderTracker() {
  return <Timeline steps={shipmentSteps} />;
}`}
    />
  );
}
