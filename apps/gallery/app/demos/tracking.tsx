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
    <Box flex={1} bg="canvas">
      <GalleryHeader title="Shipment Tracking" subtitle="Logistics Demo 1" showBack={true} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* Top Status & Tracking ID Banner */}
          <Card variant="elevated" padding="lg">
            <VStack spacing="3">
              <HStack justify="between" align="center">
                <HStack spacing="2" align="center">
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
                <Text variant="display">#SHN-849102-US</Text>
                <Text variant="caption">Carrier: Shani Express Logistics • Flight 402B</Text>
              </VStack>
            </VStack>
          </Card>

          {/* 1. ETA Card */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center">
                <HStack spacing="2" align="center">
                  <Icon name="Clock" size="md" color="brand" />
                  <Text variant="heading">Estimated Delivery</Text>
                </HStack>
                <Badge variant="success">On Schedule</Badge>
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

                <HStack justify="between" align="center">
                  <HStack spacing="3" align="center">
                    <Box
                      p="2"
                      bg="surfaceRaised"
                      borderRadius="full"
                      borderColor="subtle"
                      borderWidth="hairline"
                    >
                      <Icon name="Truck" size="md" color="brand" />
                    </Box>
                    <VStack spacing="0">
                      <Text variant="label">Courier: Sarah Jenkins</Text>
                      <Text variant="caption">Vehicle: Electric Sprinter Van 14</Text>
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
              <HStack justify="between" align="center">
                <Text variant="heading">Shipment Progress</Text>
                <Badge variant="neutral" size="sm">3 of 4 Milestones</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <Timeline steps={TRACKING_STEPS} />
            </CardContent>
          </Card>

          {/* 3. Details Card */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="heading">Consignment & Cargo Details</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="3">
                <HStack justify="between" align="center">
                  <Text variant="caption">Origin Depot:</Text>
                  <Text variant="body">Los Angeles Logistics Park (LAX-9)</Text>
                </HStack>
                <Divider />
                <HStack justify="between" align="center">
                  <Text variant="caption">Destination Address:</Text>
                  <Text variant="body">742 Evergreen Terrace, Springfield</Text>
                </HStack>
                <Divider />
                <HStack justify="between" align="center">
                  <Text variant="caption">Weight & Volume:</Text>
                  <Text variant="body">18.4 kg (0.12 m³)</Text>
                </HStack>
                <Divider />
                <HStack justify="between" align="center">
                  <Text variant="caption">Service Tier:</Text>
                  <Badge variant="brand" size="sm">Overnight Guaranteed</Badge>
                </HStack>
                <Divider />
                <HStack justify="between" align="center">
                  <Text variant="caption">Proof of Delivery:</Text>
                  <Badge variant="neutral" size="sm">Contactless Photo Required</Badge>
                </HStack>
              </VStack>
            </CardContent>
            <CardFooter>
              <HStack justify="between" align="center" style={{ width: '100%' }}>
                <Button
                  variant={notificationEnabled ? 'primary' : 'secondary'}
                  size="sm"
                  leftIcon="Bell"
                  onPress={() => setNotificationEnabled(!notificationEnabled)}
                >
                  {notificationEnabled ? 'Alerts Active' : 'Enable Alerts'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon="FileText"
                  onPress={() => console.log('Downloading PDF')}
                >
                  Download Waybill
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
}

