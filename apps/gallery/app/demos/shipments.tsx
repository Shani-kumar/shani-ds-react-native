import { useState, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  Button,
  IconButton,
  TextField,
  Skeleton,
  Icon,
  Divider,
  type BadgeVariant,
} from '@shani/ui';
import { GalleryHeader } from '../../src/components/GalleryHeader';
import { DemoContainer } from '../../src/components/DemoContainer';

interface ShipmentRecord {
  id: string;
  trackingNumber: string;
  consignee: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Out for Delivery';
  statusVariant: BadgeVariant;
  pieces: number;
  weight: string;
  eta: string;
}

const SHIPMENTS_DATA: ShipmentRecord[] = [
  {
    id: 'shp-1',
    trackingNumber: 'SHN-849102-US',
    consignee: 'Pacific Retail Distribution',
    destination: 'Springfield Regional Hub',
    status: 'Out for Delivery',
    statusVariant: 'brand',
    pieces: 4,
    weight: '18.4 kg',
    eta: 'Today, 04:30 PM',
  },
  {
    id: 'shp-2',
    trackingNumber: 'SHN-918230-CA',
    consignee: 'BioMed Pharmaceutical Labs',
    destination: 'Montreal Terminal 2',
    status: 'In Transit',
    statusVariant: 'info',
    pieces: 1,
    weight: '3.2 kg',
    eta: 'Tomorrow, 09:00 AM',
  },
  {
    id: 'shp-3',
    trackingNumber: 'SHN-620194-US',
    consignee: 'Cascade Industrial Fasteners',
    destination: 'Seattle Cross-Dock Facility',
    status: 'Delivered',
    statusVariant: 'success',
    pieces: 12,
    weight: '142.0 kg',
    eta: 'Delivered 01:15 PM',
  },
  {
    id: 'shp-4',
    trackingNumber: 'SHN-501934-MX',
    consignee: 'Monterrey Manufacturing Plant',
    destination: 'Monterrey Customhouse',
    status: 'Delayed',
    statusVariant: 'danger',
    pieces: 8,
    weight: '88.5 kg',
    eta: 'Border Inspection Hold',
  },
  {
    id: 'shp-5',
    trackingNumber: 'SHN-773921-US',
    consignee: 'Pacific Horizon Logistics',
    destination: 'San Diego Harbor Pier 14',
    status: 'In Transit',
    statusVariant: 'info',
    pieces: 2,
    weight: '11.8 kg',
    eta: 'Nov 02, 11:30 AM',
  },
];

type FilterType = 'All' | 'Out for Delivery' | 'In Transit' | 'Delivered' | 'Delayed';

export default function ShipmentsListDemo() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isLoading, setIsLoading] = useState(false);

  const filteredShipments = useMemo(() => {
    return SHIPMENTS_DATA.filter((item) => {
      const matchesSearch =
        item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <DemoContainer title="Shipments Fleet List" subtitle="Realistic courier waybill dispatch workflow">
      <Box flex={1} bg="canvas">
        <GalleryHeader title="Shipments Fleet List" subtitle="Logistics Demo 2" showBack={true} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* Search & Filter Controls */}
          <Card variant="elevated" padding="lg">
            <VStack spacing="4">
              <HStack justify="between" align="center" wrap={true} spacing="3">
                <VStack spacing="1" style={{ flex: 1, minWidth: 180 }}>
                  <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>Active Waybills</Text>
                  <Text variant="caption" style={{ flexShrink: 1, minWidth: 0 }}>
                    Filter and inspect fleet parcels in real time
                  </Text>
                </VStack>
                <Button
                  variant={isLoading ? 'primary' : 'secondary'}
                  size="sm"
                  leftIcon="RefreshCw"
                  onPress={() => setIsLoading(!isLoading)}
                >
                  {isLoading ? 'Show Loaded' : 'Simulate Loading'}
                </Button>
              </HStack>

              {/* Search TextField */}
              <TextField
                label="Search Shipments"
                placeholder="Search by tracking number, consignee, or hub..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                prefix={<Icon name="Search" size="sm" color="secondary" />}
                helperText={`Displaying ${filteredShipments.length} matching waybills`}
              />

              {/* Filter Chips */}
              <VStack spacing="2">
                <Text variant="caption">Status Filter:</Text>
                <HStack spacing="2" wrap={true}>
                  {(['All', 'Out for Delivery', 'In Transit', 'Delivered', 'Delayed'] as FilterType[]).map(
                    (filter) => (
                      <Button
                        key={filter}
                        variant={activeFilter === filter ? 'primary' : 'ghost'}
                        size="sm"
                        onPress={() => setActiveFilter(filter)}
                      >
                        {filter}
                      </Button>
                    )
                  )}
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Shipment List or Loading Skeletons */}
          {isLoading ? (
            <VStack spacing="4">
              <Text variant="label">Fetching Fleet Manifest...</Text>
              {[1, 2, 3].map((key) => (
                <Card key={key} variant="outlined" padding="md">
                  <VStack spacing="3">
                    <HStack justify="between" align="center">
                      <Skeleton variant="text" width={140} height={18} />
                      <Skeleton variant="text" width={90} height={20} />
                    </HStack>
                    <Skeleton variant="text" width="75%" height={14} />
                    <Skeleton variant="text" width="50%" height={14} />
                    <HStack justify="between" align="center">
                      <Skeleton variant="text" width={100} height={14} />
                      <Skeleton variant="rectangular" width={110} height={36} />
                    </HStack>
                  </VStack>
                </Card>
              ))}
            </VStack>
          ) : (
            <VStack spacing="4">
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>Waybill Results ({filteredShipments.length})</Text>
                <Badge variant="neutral" size="sm" style={{ flexShrink: 0 }}>Fleet Active</Badge>
              </HStack>

              {filteredShipments.length === 0 ? (
                <Card variant="outlined" padding="lg">
                  <VStack spacing="2" align="center">
                    <Icon name="PackageX" size="lg" color="secondary" />
                    <Text variant="title">No Shipments Found</Text>
                    <Text variant="caption">Try adjusting your tracking number query or status filter.</Text>
                  </VStack>
                </Card>
              ) : (
                filteredShipments.map((shipment) => (
                  <Card key={shipment.id} variant="outlined" padding="md">
                    <VStack spacing="3">
                      {/* Top row: Tracking number (flex: 1, wraps) on the left; icon-only utility actions (Print) top-right */}
                      <HStack justify="between" align="center" wrap={true} spacing="2">
                        <VStack spacing="0" style={{ flex: 1, minWidth: 140 }}>
                          <Text variant="heading" style={{ flexShrink: 1, minWidth: 0 }}>
                            {shipment.trackingNumber}
                          </Text>
                          <Text variant="caption" color="secondary" style={{ flexShrink: 1, minWidth: 0 }}>
                            {shipment.consignee}
                          </Text>
                        </VStack>
                        <IconButton
                          name="Printer"
                          accessibilityLabel={`Print label for ${shipment.trackingNumber}`}
                          variant="ghost"
                          size="sm"
                        />
                      </HStack>

                      {/* Below: status Badge, then location and package info (wraps) */}
                      <VStack spacing="2">
                        <HStack spacing="2" align="center" wrap={true}>
                          <Badge variant={shipment.statusVariant} dot={true} style={{ flexShrink: 0 }}>
                            {shipment.status}
                          </Badge>
                        </HStack>
                        <HStack spacing="4" align="center" wrap={true}>
                          <HStack spacing="1" align="center" style={{ flexShrink: 1, minWidth: 0 }}>
                            <Icon name="MapPin" size="xs" color="secondary" />
                            <Text variant="caption" style={{ flexShrink: 1, minWidth: 0 }}>
                              {shipment.destination}
                            </Text>
                          </HStack>
                          <HStack spacing="1" align="center" style={{ flexShrink: 1, minWidth: 0 }}>
                            <Icon name="Layers" size="xs" color="secondary" />
                            <Text variant="caption" style={{ flexShrink: 1, minWidth: 0 }}>
                              {shipment.pieces} pkgs ({shipment.weight})
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>

                      <Divider />

                      {/* Footer row: ETA on the left, ONE main action ("Track Live" with chevron) on the right */}
                      <HStack justify="between" align="center" wrap={true} spacing="3" style={{ width: '100%' }}>
                        <HStack spacing="1" align="center" wrap={true} style={{ flex: 1, minWidth: 140 }}>
                          <Icon name="Clock" size="xs" color="brand" />
                          <Text variant="label" style={{ fontWeight: '600', flexShrink: 1, minWidth: 0 }}>
                            {shipment.eta}
                          </Text>
                        </HStack>
                        <Button
                          variant="secondary"
                          size="sm"
                          rightIcon="ChevronRight"
                          onPress={() => router.push('/demos/tracking')}
                          style={{ flexGrow: 1, flexBasis: 120, maxWidth: '100%' }}
                        >
                          Track Live
                        </Button>
                      </HStack>
                    </VStack>
                  </Card>
                ))
              )}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  </DemoContainer>
  );
}
