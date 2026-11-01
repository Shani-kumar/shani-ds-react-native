import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Checkbox,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Checkbox');

export default function CheckboxPage() {
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
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
      propsData={formatPropsForGallery(doc.props)}
      dos={doc.whenToUse}
      donts={doc.whenNotToUse}
      a11yNotes={doc.accessibilityNotes}
      codeSnippet={doc.example}
    />
  );
}
