import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Switch,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Switch');

export default function SwitchPage() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <VStack spacing="2" align="center">
          <Switch
            checked={checked}
            disabled={disabled}
            label="Real-Time GPS Route Optimization"
            onChange={setChecked}
          />
        </VStack>
      }
      playgroundControls={
        <HStack spacing="2" align="center" wrap={true}>
          <SegmentedOption
            label={`State: ${checked ? 'Active' : 'Inactive'}`}
            selected={checked}
            onPress={() => setChecked(!checked)}
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
              <Switch
                checked={true}
                label="Automated Dispatch Assignment (Active)"
              />
              <Switch
                checked={false}
                label="Night Mode Delivery Lighting (Inactive)"
              />
              <Switch
                checked={true}
                disabled={true}
                label="Cold Chain Temperature Monitoring (Locked)"
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
