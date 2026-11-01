import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  TextField,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('TextField');

export default function TextFieldPage() {
  const [value, setValue] = useState('SHN-741920-US');
  const [hasError, setHasError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [secure, setSecure] = useState(false);

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <Box style={{ width: '100%' }}>
          <TextField
            label="Shipment Tracking Number"
            placeholder="e.g. SHN-000000-XX"
            value={value}
            onChangeText={setValue}
            error={hasError ? 'Tracking number not found in regional hub' : undefined}
            helperText="Enter the 10-character alphanumeric waybill code"
            disabled={disabled}
            secureTextEntry={secure}
            showSecureToggle={secure}
            prefix={<Icon name="Search" size="sm" color="secondary" />}
            required={true}
          />
        </Box>
      }
      playgroundControls={
        <HStack spacing="2" align="center" wrap={true}>
          <SegmentedOption
            label={`Error: ${hasError ? 'On' : 'Off'}`}
            selected={hasError}
            onPress={() => setHasError(!hasError)}
          />
          <SegmentedOption
            label={`Disabled: ${disabled ? 'On' : 'Off'}`}
            selected={disabled}
            onPress={() => setDisabled(!disabled)}
          />
          <SegmentedOption
            label={`Secure: ${secure ? 'On' : 'Off'}`}
            selected={secure}
            onPress={() => setSecure(!secure)}
          />
        </HStack>
      }
      allStates={
        <VStack spacing="4">
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <VStack spacing="4">
              <TextField
                label="Recipient Postal Code"
                placeholder="90210"
                helperText="5-digit domestic US ZIP code"
                prefix={<Icon name="MapPin" size="sm" color="secondary" />}
              />
              <TextField
                label="Driver Security PIN"
                placeholder="••••"
                secureTextEntry={true}
                showSecureToggle={true}
                helperText="4-digit access code for depot gate"
              />
              <TextField
                label="Weight (kg)"
                value="45.5"
                suffix={<Text variant="caption">KG</Text>}
                disabled={true}
                helperText="Locked by calibrated scale"
              />
            </VStack>
          </Box>
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
