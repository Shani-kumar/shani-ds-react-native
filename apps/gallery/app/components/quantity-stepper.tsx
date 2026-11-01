import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  QuantityStepper,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('QuantityStepper');

export default function QuantityStepperPage() {
  const [count, setCount] = useState<number>(3);
  const [step, setStep] = useState<number>(1);
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <VStack spacing="4" align="center" style={{ width: '100%' }}>
          <QuantityStepper
            label="Cargo Pallets"
            value={count}
            min={1}
            max={10}
            step={step}
            unit="pallets"
            disabled={disabled}
            onChange={setCount}
          />
          <Text variant="caption">
            Value: {count} | Step: {step} | Min: 1 | Max: 10
          </Text>
        </VStack>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Step Delta:</Text>
            <SegmentedOption
              label="Step 1"
              selected={step === 1}
              onPress={() => setStep(1)}
            />
            <SegmentedOption
              label="Step 2"
              selected={step === 2}
              onPress={() => setStep(2)}
            />
            <SegmentedOption
              label="Step 5"
              selected={step === 5}
              onPress={() => setStep(5)}
            />
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">State:</Text>
            <SegmentedOption
              label={disabled ? 'Disabled' : 'Enabled'}
              selected={disabled}
              onPress={() => setDisabled(!disabled)}
            />
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Boundary & Unit States</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <VStack spacing="4">
              <HStack spacing="4" wrap={true} align="center">
                <QuantityStepper
                  label="At Min (1)"
                  defaultValue={1}
                  min={1}
                  max={5}
                />
                <QuantityStepper
                  label="At Max (5)"
                  defaultValue={5}
                  min={1}
                  max={5}
                />
                <QuantityStepper
                  label="With Unit"
                  defaultValue={12}
                  unit="kg"
                  step={2}
                />
                <QuantityStepper
                  label="Disabled"
                  defaultValue={4}
                  disabled={true}
                  unit="crates"
                />
              </HStack>
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
