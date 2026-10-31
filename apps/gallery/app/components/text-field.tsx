import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Icon,
  Text,
  TextField,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function TextFieldPage() {
  const [value, setValue] = useState('SHN-741920-US');
  const [hasError, setHasError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [secure, setSecure] = useState(false);

  return (
    <ComponentPage
      title="TextField"
      description="Accessible text input built on useTextField with error association, secure text toggles, and tokenized border states."
      category="Forms"
      playground={
        <Box style={{ width: '100%', maxWidth: 360 }}>
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
          <Button
            variant={hasError ? 'danger' : 'secondary'}
            size="sm"
            onPress={() => setHasError(!hasError)}
          >
            Toggle Error State
          </Button>
          <Button
            variant={disabled ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setDisabled(!disabled)}
          >
            Toggle Disabled
          </Button>
          <Button
            variant={secure ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setSecure(!secure)}
          >
            Toggle Secure Entry
          </Button>
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
      propsData={[
        { name: 'label', type: 'string', default: 'undefined', description: 'Field label rendered above the input.' },
        { name: 'placeholder', type: 'string', default: 'undefined', description: 'Hint text displayed when input is empty.' },
        { name: 'helperText', type: 'string', default: 'undefined', description: 'Descriptive guidance rendered below input.' },
        { name: 'error', type: 'boolean | string', default: 'undefined', description: 'Error message that highlights border in danger and updates accessibilityHint.' },
        { name: 'prefix', type: 'React.ReactNode', default: 'undefined', description: 'Leading icon or element rendered inside input.' },
        { name: 'suffix', type: 'React.ReactNode', default: 'undefined', description: 'Trailing icon or element rendered inside input.' },
        { name: 'secureTextEntry', type: 'boolean', default: 'false', description: 'Masks characters for security.' },
        { name: 'showSecureToggle', type: 'boolean', default: 'false', description: 'Renders an accessible visibility toggle button.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Appends a required indicator to the label.' },
      ]}
      dos={[
        'Always provide a visible label or accessibilityLabel for screen reader clarity.',
        'Use error to communicate specific validation failures (e.g. invalid format).',
        'Use prefix/suffix elements to hint at the input format (e.g. MapPin for address).',
      ]}
      donts={[
        'Never rely solely on placeholder text as a label, as it disappears on input.',
        'Never hide error messages without announcing them via accessibilityHint.',
      ]}
      a11yNotes={[
        'TextField binds error text directly to accessibilityHint so screen readers announce errors immediately upon field focus.',
        'Enforces a minimum 44pt touch height to satisfy WCAG AA target size criteria.',
      ]}
      codeSnippet={`import { TextField, Icon } from '@shani/ui';

export function WaybillInput() {
  return (
    <TextField
      label="Waybill Number"
      placeholder="e.g. 1Z9999999999999999"
      prefix={<Icon name="Package" size="sm" />}
      helperText="Enter 18-digit carrier barcode number"
      required={true}
    />
  );
}`}
    />
  );
}
