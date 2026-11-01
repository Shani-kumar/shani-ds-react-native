import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  ThemeProvider,
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  TextField,
  Card,
  Button,
  ChipGroup,
  QuantityStepper,
} from '@shani/ui';

const dateOptions = [
  { value: 'nov3', label: 'Mon, Nov 3' },
  { value: 'nov4', label: 'Tue, Nov 4' },
  { value: 'nov5', label: 'Wed, Nov 5' },
];

const timeOptions = [
  { value: 'slot1', label: '9:00-11:00 AM' },
  { value: 'slot2', label: '11:00 AM-1:00 PM' },
  { value: 'slot3', label: '2:00-4:00 PM' },
];

export function SchedulePickupScreen() {
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield');
  const [selectedDate, setSelectedDate] = useState<string | string[] | null>('nov3');
  const [selectedTime, setSelectedTime] = useState<string | string[] | null>('slot1');
  const [packageCount, setPackageCount] = useState(3);
  const [instructions, setInstructions] = useState('');

  return (
    <Box
      flex={1}
      bg="canvas"
      p="4"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
      >
        <Box
          bg="surface"
          borderRadius="2xl"
          borderWidth="thin"
          borderColor="subtle"
          p="6"
          shadow="md"
          style={{
            width: '100%',
            maxWidth: 440,
          }}
        >
          <VStack spacing="5">
            {/* Header */}
            <HStack spacing="3" align="center">
              <IconButton
                name="ChevronLeft"
                variant="ghost"
                size="sm"
                accessibilityLabel="Back"
                onPress={() => {}}
              />
              <Text variant="heading">Schedule Pickup</Text>
            </HStack>

            {/* Pickup Address */}
            <TextField
              label="Pickup address"
              value={address}
              onChangeText={setAddress}
              prefix={<Icon name="MapPin" size="sm" color="secondary" />}
            />

            {/* Pickup Date */}
            <ChipGroup
              label="Pickup date"
              options={dateOptions}
              value={selectedDate}
              onChange={setSelectedDate}
            />

            {/* Time Slot */}
            <ChipGroup
              label="Time slot"
              options={timeOptions}
              value={selectedTime}
              onChange={setSelectedTime}
            />

            {/* Packages */}
            <QuantityStepper
              label="Packages"
              value={packageCount}
              min={1}
              unit="packages"
              onChange={setPackageCount}
              style={{ alignSelf: 'flex-start' }}
            />

            {/* Special Instructions */}
            <TextField
              label="Special instructions"
              placeholder="Gate code or dock number"
              value={instructions}
              onChangeText={setInstructions}
            />

            {/* Estimated Rate Card */}
            <Card variant="outlined" padding="md">
              <HStack justify="between" align="center">
                <VStack spacing="1">
                  <Text variant="body" weight="medium">
                    Estimated rate
                  </Text>
                  <Text variant="caption" color="secondary">
                    Standard next-day pickup
                  </Text>
                </VStack>
                <Text variant="heading" weight="bold">
                  $24.50
                </Text>
              </HStack>
            </Card>

            {/* Confirm Pickup Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => alert('Pickup scheduled!')}
            >
              Confirm pickup
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider initialMode="light">
      <SchedulePickupScreen />
    </ThemeProvider>
  );
}
