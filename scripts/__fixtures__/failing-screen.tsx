import React from 'react';
// Violation 1: Forbidden imports from 'react-native'
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  Button as RNButton,
  Pressable as RNPressable,
} from 'react-native';
// Violation 2: Hallucinated component from '@shani/ui'
import {
  Button,
  Badge,
  Modal,
  Slider,
} from '@shani/ui';

export function FailingScreenFixture() {
  return (
    // Violation 3: Raw numeric styling and hex colors
    <View
      style={{
        backgroundColor: '#1D4ED8',
        margin: 16,
        padding: 12,
        borderRadius: 8,
        fontSize: 20,
      }}
    >
      <RNText style={{ color: '#FFFFFF' }}>Legacy Text</RNText>
      <RNTextInput placeholder="Enter text" />
      <RNButton title="Press Me" onPress={() => {}} />
      <RNPressable onPress={() => {}} />

      {/* Violation 4: Unknown prop and invalid union value */}
      <Button
        variant="ultra"
        fakeProp="invalid"
      >
        Invalid Button
      </Button>

      {/* Violation 5: Invalid badge variant */}
      <Badge variant="unsupportedVariant">
        Invalid Badge
      </Badge>

      {/* Violation 6: Hallucinated components in JSX */}
      <Modal />
      <Slider />
    </View>
  );
}
