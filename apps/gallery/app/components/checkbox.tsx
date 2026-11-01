import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Checkbox,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';

export default function CheckboxPage() {
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentPage
      title="Checkbox"
      description="Ternary selection primitive supporting checked, unchecked, and indeterminate (mixed) states with Reanimated spring physics."
      category="Forms"
      playground={
        <VStack spacing="2" align="center">
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            label="Hazardous Cargo Handling (Class 3 Flammable)"
            onChange={(val) => {
              if (indeterminate) {
                setIndeterminate(false);
                setChecked(true);
              } else {
                setChecked(val);
              }
            }}
          />
        </VStack>
      }
      playgroundControls={
        <HStack spacing="2" align="center" wrap={true}>
          <SegmentedOption
            label={`Checked: ${checked && !indeterminate ? 'On' : 'Off'}`}
            selected={checked && !indeterminate}
            onPress={() => {
              setIndeterminate(false);
              setChecked(!checked);
            }}
          />
          <SegmentedOption
            label={`Indeterminate: ${indeterminate ? 'On' : 'Off'}`}
            selected={indeterminate}
            onPress={() => setIndeterminate(!indeterminate)}
          />
          <SegmentedOption
            label={`Disabled: ${disabled ? 'On' : 'Off'}`}
            selected={disabled}
            onPress={() => setDisabled(!disabled)}
          />
        </HStack>
      }
      allStates={
        <VStack spacing="4">
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <VStack spacing="4">
              <Checkbox
                checked={true}
                label="Express Morning Delivery (Checked)"
              />
              <Checkbox
                checked={false}
                label="Saturday Delivery Option (Unchecked)"
              />
              <Checkbox
                checked={false}
                indeterminate={true}
                label="Pallet Batch Selection (Indeterminate / Mixed)"
              />
              <Checkbox
                checked={true}
                disabled={true}
                label="Customs Clearance Verified (Disabled)"
              />
            </VStack>
          </Box>
        </VStack>
      }
      propsData={[
        {
          name: 'checked',
          type: 'boolean',
          default: 'false',
          description: 'Controlled checked boolean state.',
          example: 'checked={isSelected}',
        },
        {
          name: 'onChange',
          type: '(checked: boolean) => void',
          default: 'None',
          description: 'Callback invoked with the new boolean state when toggled.',
          example: 'onChange={(val) => setIsSelected(val)}',
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          default: 'false',
          description: 'Displays a horizontal minus icon representing partial subset selection.',
          example: 'indeterminate={hasPartialSelection}',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables press interactions and applies accessible muted tokens.',
          example: 'disabled={false}',
        },
        {
          name: 'label',
          type: 'string | React element',
          default: 'None',
          description: 'Visible label text or React element rendered adjacent to the checkbox.',
          example: 'label="Hazardous Cargo Handling"',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Size tier for box and icon (sm=16pt, md=20pt, lg=24pt). Touch container enforces ≥44x44pt.',
          example: 'size="md"',
        },
        {
          name: 'accessibilityLabel',
          type: 'string',
          default: 'None',
          description: 'Spoken description for screen readers. Defaults to string label if omitted.',
          example: 'accessibilityLabel="Confirm pallet weights"',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout positioning only (margin, flex). Box dimensions, borders, and colors must come from tokens.',
          example: 'style={{ marginVertical: 4 }}',
        },
      ]}
      dos={[
        'Use indeterminate when a parent checkbox controls a list where some, but not all, items are checked.',
        'Always provide a descriptive label so warehouse operators understand what option is toggled.',
        'Keep the 44x44pt hit area unobstructed for easy tapping with industrial work gloves.',
      ]}
      donts={[
        'Never use a checkbox for mutually exclusive choices; use Radio or SegmentedControl.',
        'Never trigger instant disruptive actions on checkbox change; use for form selections.',
      ]}
      a11yNotes={[
        'Checkbox maps states to native accessibilityState: { checked: indeterminate ? "mixed" : checked }.',
        'TalkBack and VoiceOver announce indeterminate checkboxes as "mixed, checkbox".',
      ]}
      codeSnippet={`import { useState } from 'react';
import { Checkbox } from '@shani/ui';

export function ManifestSelection() {
  const [selected, setSelected] = useState(false);

  return (
    <Checkbox
      checked={selected}
      onChange={setSelected}
      label="Heavy Lift Equipment Required"
    />
  );
}`}
    />
  );
}
