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
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Timeline');

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
      title={doc.name}
      description={doc.description}
      category={doc.category}
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
      propsData={formatPropsForGallery(doc.props)}
      dos={doc.whenToUse}
      donts={doc.whenNotToUse}
      a11yNotes={doc.accessibilityNotes}
      codeSnippet={doc.example}
    />
  );
}
