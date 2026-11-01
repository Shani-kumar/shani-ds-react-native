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
        {
          name: 'label',
          type: 'string',
          default: 'None',
          description: 'Visible field label rendered above the input. Recommended for all forms.',
          example: 'label="Tracking Number"',
        },
        {
          name: 'value',
          type: 'string',
          default: 'None',
          description: 'Controlled text input value managed by React state.',
          example: 'value={trackingId}',
        },
        {
          name: 'onChangeText',
          type: '(text: string) => void',
          default: 'None',
          description: 'Callback invoked with new string content on every keystroke.',
          example: 'onChangeText={(val) => setTrackingId(val)}',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: 'None',
          description: 'Transient placeholder hint text displayed when input is empty.',
          example: 'placeholder="e.g. SHN-849102-US"',
        },
        {
          name: 'helperText',
          type: 'string',
          default: 'None',
          description: 'Descriptive guidance or format hint rendered below the field.',
          example: 'helperText="Format: SHN-XXXXXX-US"',
        },
        {
          name: 'error',
          type: 'boolean | string',
          default: 'None',
          description: 'Error message string or boolean flag that switches border to danger token and binds to accessibilityHint.',
          example: 'error="Invalid barcode format"',
        },
        {
          name: 'prefix',
          type: 'React element',
          default: 'None',
          description: 'Leading icon or adornment element rendered inside the input box.',
          example: 'prefix={<Icon name="Search" size="sm" color="secondary" />}',
        },
        {
          name: 'suffix',
          type: 'React element',
          default: 'None',
          description: 'Trailing icon or action adornment element rendered inside the input box.',
          example: 'suffix={<Icon name="Check" size="sm" color="success" />}',
        },
        {
          name: 'secureTextEntry',
          type: 'boolean',
          default: 'false',
          description: 'Masks typed characters for secure credentials and PIN codes.',
          example: 'secureTextEntry={true}',
        },
        {
          name: 'showSecureToggle',
          type: 'boolean',
          default: 'false',
          description: 'Renders an accessible visibility toggle button when secureTextEntry is true.',
          example: 'showSecureToggle={true}',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Input height tier (sm=44pt, md=48pt, lg=56pt). All tiers enforce ≥44pt touch targets.',
          example: 'size="md"',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables editing and applies muted theme background and border tokens.',
          example: 'disabled={false}',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Appends a required indicator to the label and marks accessibilityState.',
          example: 'required={true}',
        },
        {
          name: 'containerStyle',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer wrapper layout constraints only (margin, flex). Border styles, focus ring, and padding are token-governed.',
          example: 'containerStyle={{ marginBottom: 12 }}',
        },
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
