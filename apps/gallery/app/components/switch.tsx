import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Switch,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function SwitchPage() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentPage
      title="Switch"
      description="Binary toggle primitive with Reanimated UI-thread spring physics (motion.spring.snappy) and reduced-motion fallback."
      category="Forms"
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
        <HStack spacing="2" align="center">
          <Button
            variant={checked ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setChecked(!checked)}
          >
            Toggle On/Off ({checked ? 'Active' : 'Inactive'})
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
      propsData={[
        { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the switch is toggled on.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents user interaction.' },
        { name: 'label', type: 'string', default: 'undefined', description: 'Primary label text.' },
        { name: 'onChange', type: '(checked: boolean) => void', default: 'undefined', description: 'Callback invoked when toggle state changes.' },
      ]}
      dos={[
        'Use switches for instantaneous binary state settings (e.g. Turn on Geofencing).',
        'Provide clear affirmative labels describing what happens when turned on.',
        'Ensure the switch track and thumb maintain WCAG AA contrast against card backgrounds.',
      ]}
      donts={[
        'Never use a switch when a user must submit the change via a "Save" button; use Checkbox instead.',
        'Never invert the meaning (e.g. "Disable Notifications" switched to ON).',
      ]}
      a11yNotes={[
        'Switch applies accessibilityRole="switch" and accessibilityState={{ checked }}.',
        'The thumb translates across the track using Reanimated on the UI thread, instantly disabling animation if useReducedMotion() is active.',
      ]}
      codeSnippet={`import { Switch } from '@shani/ui';

export function DispatchSettings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      label="High-Priority Dispatch Alerts"
    />
  );
}`}
    />
  );
}
