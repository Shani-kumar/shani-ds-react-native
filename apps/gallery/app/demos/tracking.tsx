import { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Timeline,
  Button,
  IconButton,
  Divider,
  Icon,
  type TimelineStep,
} from '@shani/ui';
import { GalleryHeader } from '../../src/components/GalleryHeader';
import { DemoContainer } from '../../src/components/DemoContainer';

const TRACKING_STEPS: TimelineStep[] = [
  {
    id: 'step-1',
    title: 'Order Placed & Electronic Waybill Created',
    timestamp: '07:15 AM • Oct 31, 2026',
    description: 'Manifest generated at Los Angeles Freight Terminal (Gate 12)',
    state: 'completed',
  },
  {
    id: 'step-2',
    title: 'Sorted & Scanned at Ontario Regional Hub',
    timestamp: '11:40 AM • Oct 31, 2026',
    description: 'Cross-dock sorting completed. Package routed to Van #14',
    state: 'completed',
  },
  {
    id: 'step-3',
    title: 'Out for Courier Delivery',
    timestamp: '02:15 PM • Oct 31, 2026',
    description: 'Courier Sarah J. has departed the facility with 12 stops remaining',
    state: 'current',
  },
  {
    id: 'step-4',
    title: 'Final Delivery Confirmation',
    timestamp: 'Estimated 04:30 PM • Oct 31, 2026',
    description: 'Contactless doorstep dropoff with photo verification',
    state: 'upcoming',
  },
];

export default function ShipmentTrackingDemo() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  return (
    <DemoContainer title="Shipment Tracking" subtitle="Milestone stepper and parcel delivery workflow">
      <Box flex={1} bg="canvas">
        <GalleryHeader title="Shipment Tracking" subtitle="Logistics Demo 1" showBack={true} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* Top Status & Tracking ID Banner */}
          <Card variant="elevated" padding="lg">
            <VStack spacing="3">
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <HStack spacing="2" align="center" wrap={true}>
                  <Badge variant="brand" dot={true}>Out for Delivery</Badge>
                  <Badge variant="neutral" size="sm">Priority Air</Badge>
                </HStack>
                <IconButton
                  name="Share2"
                  accessibilityLabel="Share tracking waybill link"
                  variant="ghost"
                  size="sm"
                />
              </HStack>

              <VStack spacing="1">
                <Text variant="heading" style={{ flexShrink: 1, minWidth: 0 }}>#SHN-849102-US</Text>
                <Text variant="caption">Carrier: Shani Express Logistics • Flight 402B</Text>
              </VStack>
            </VStack>
          </Card>

          {/* 1. ETA Card */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <HStack spacing="2" align="center" wrap={true} style={{ flexShrink: 1, minWidth: 0 }}>
                  <Icon name="Clock" size="md" color="brand" />
                  <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>Estimated Delivery</Text>
                </HStack>
                <Badge variant="success" style={{ flexShrink: 0 }}>On Schedule</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="4">
                <VStack spacing="1">
                  <Text variant="display">Today, 04:30 PM</Text>
                  <Text variant="body" color="secondary">
                    Estimated arrival window: 04:15 PM – 04:45 PM
                  </Text>
                </VStack>

                <Divider />

                <HStack justify="between" align="center" wrap={true} spacing="3">
                  <HStack spacing="3" align="center" wrap={true} style={{ flexShrink: 1, minWidth: 0 }}>
                    <Box
                      p="2"
                      bg="surfaceRaised"
                      borderRadius="full"
                      borderColor="subtle"
                      borderWidth="hairline"
                      style={{ flexShrink: 0 }}
                    >
                      <Icon name="Truck" size="md" color="brand" />
                    </Box>
                    <VStack spacing="0" style={{ flexShrink: 1, minWidth: 0 }}>
                      <Text variant="label" style={{ flexShrink: 1, minWidth: 0 }}>Courier: Sarah Jenkins</Text>
                      <Text variant="caption" style={{ flexShrink: 1, minWidth: 0 }}>Vehicle: Electric Sprinter Van 14</Text>
                    </VStack>
                  </HStack>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon="Phone"
                    onPress={() => console.log('Calling dispatcher')}
                  >
                    Contact
                  </Button>
                </HStack>
              </VStack>
            </CardContent>
          </Card>

          {/* 2. Timeline Stepper */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>Shipment Progress</Text>
                <Badge variant="neutral" size="sm" style={{ flexShrink: 0 }}>3 of 4 Milestones</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <Timeline steps={TRACKING_STEPS} />
            </CardContent>
          </Card>

          {/* 3. Details Card */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title">Consignment & Cargo Details</Text>
                <IconButton
                  name="Bell"
                  accessibilityLabel={notificationEnabled ? 'Mute delivery notifications' : 'Enable delivery notifications'}
                  variant="ghost"
                  size="sm"
                  onPress={() => setNotificationEnabled(!notificationEnabled)}
                />
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="3">
                <HStack justify="between" align="center" wrap={true} spacing="2">
                  <Text variant="caption" style={{ flexShrink: 0 }}>Origin Depot:</Text>
                  <Text variant="body" style={{ flexShrink: 1, minWidth: 0, textAlign: 'right' }}>Los Angeles Logistics Park (LAX-9)</Text>
                </HStack>
                <Divider />
                <HStack justify="between" align="center" wrap={true} spacing="2">
                  <Text variant="caption" style={{ flexShrink: 0 }}>Destination Address:</Text>
                  <Text variant="body" style={{ flexShrink: 1, minWidth: 0, textAlign: 'right' }}>742 Evergreen Terrace, Springfield</Text>
                </HStack>
                <Divider />
                <HStack justify="between" align="center" wrap={true} spacing="2">
                  <Text variant="caption" style={{ flexShrink: 0 }}>Weight & Volume:</Text>
                  <Text variant="body" style={{ flexShrink: 1, minWidth: 0, textAlign: 'right' }}>18.4 kg (0.12 m³)</Text>
                </HStack>
                <Divider />
                <HStack justify="between" align="center" wrap={true} spacing="2">
                  <Text variant="caption" style={{ flexShrink: 0 }}>Service Tier:</Text>
                  <Badge variant="brand" size="sm" style={{ flexShrink: 0 }}>Overnight Guaranteed</Badge>
                </HStack>
                <Divider />
                <HStack justify="between" align="center" wrap={true} spacing="2">
                  <Text variant="caption" style={{ flexShrink: 0 }}>Proof of Delivery:</Text>
                  <Badge variant="neutral" size="sm" style={{ flexShrink: 0 }}>Contactless Photo Required</Badge>
                </HStack>
              </VStack>
            </CardContent>
            <CardFooter>
              <HStack justify="end" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon="FileText"
                  onPress={() => console.log('Downloading PDF')}
                  style={{ flexGrow: 1, flexBasis: 140, maxWidth: '100%' }}
                >
                  Download Waybill
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  </DemoContainer>
  );
}

