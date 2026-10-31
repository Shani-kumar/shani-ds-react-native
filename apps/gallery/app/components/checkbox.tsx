import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Checkbox,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

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
          <Button
            variant={checked && !indeterminate ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => {
              setIndeterminate(false);
              setChecked(!checked);
            }}
          >
            Toggle Checked
          </Button>
          <Button
            variant={indeterminate ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setIndeterminate(!indeterminate)}
          >
            Toggle Indeterminate
          </Button>
          <Button
            variant={disabled ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setDisabled(!disabled)}
          >
            Toggle Disabled
          </Button>
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
        { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is selected.' },
        { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Displays horizontal minus dash for partial subset selection.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies muted opacity.' },
        { name: 'label', type: 'string', default: 'undefined', description: 'Label text beside the checkbox.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size tier. All sizes meet 44x44pt touch minimum.' },
        { name: 'onChange', type: '(checked: boolean) => void', default: 'undefined', description: 'Callback fired on toggle.' },
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
      codeSnippet={`import { Checkbox } from '@shani/ui';

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
