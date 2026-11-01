import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Switch,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';

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
      propsData={[
        {
          name: 'checked',
          type: 'boolean',
          default: 'false',
          description: 'Controlled checked boolean state.',
          example: 'checked={isEnabled}',
        },
        {
          name: 'onChange',
          type: '(checked: boolean) => void',
          default: 'None',
          description: 'Callback invoked with the new boolean state when toggled.',
          example: 'onChange={(val) => setIsEnabled(val)}',
        },
        {
          name: 'label',
          type: 'string | React element',
          default: 'None',
          description: 'Visible label text or React element rendered adjacent to the switch.',
          example: 'label="Automatic GPS Tracking"',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Switch track and thumb size tier (sm=36x20, md=44x24, lg=52x28). Minimum touch target enforces ≥44x44pt.',
          example: 'size="md"',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables user interactions and applies accessible muted tokens.',
          example: 'disabled={false}',
        },
        {
          name: 'accessibilityLabel',
          type: 'string',
          default: 'None',
          description: 'Spoken description for screen readers. Defaults to label text if omitted.',
          example: 'accessibilityLabel="High-priority dispatch alerts"',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout positioning only (margin, flex). Track dimensions, spring animations, and colors come from tokens.',
          example: 'style={{ marginVertical: 4 }}',
        },
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
      codeSnippet={`import { useState } from 'react';
import { Switch } from '@shani/ui';

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
