import { useState, useCallback } from 'react';
import type { AccessibilityRole, AccessibilityState } from 'react-native';

export type ToggleRole = 'checkbox' | 'switch' | 'radio';

export interface UseToggleOptions {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  role?: ToggleRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface UseToggleState {
  isChecked: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  setChecked: (checked: boolean) => void;
  toggle: () => void;
}

export interface ToggleProps {
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityState: AccessibilityState;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface UseToggleReturn {
  state: UseToggleState;
  toggleProps: ToggleProps;
}

/**
 * Headless hook managing binary toggle states (checkbox, switch, radio) with ARIA compliance.
 */
export function useToggle(options: UseToggleOptions = {}): UseToggleReturn {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    disabled = false,
    readOnly = false,
    role = 'checkbox',
    accessibilityLabel,
    accessibilityHint,
    testID,
  } = options;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const setChecked = useCallback(
    (newChecked: boolean) => {
      if (disabled || readOnly) return;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    },
    [disabled, readOnly, isControlled, onChange]
  );

  const toggle = useCallback(() => {
    setChecked(!isChecked);
  }, [setChecked, isChecked]);

  const handlePressIn = useCallback(() => {
    if (!disabled && !readOnly) {
      setIsPressed(true);
    }
  }, [disabled, readOnly]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (!disabled && !readOnly) {
      setIsFocused(true);
      options.onFocus?.();
    }
  }, [disabled, readOnly, options]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    options.onBlur?.();
  }, [options]);

  return {
    state: {
      isChecked,
      isPressed,
      isFocused,
      isDisabled: disabled,
      isReadOnly: readOnly,
      setChecked,
      toggle,
    },
    toggleProps: {
      onPress: toggle,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled,
      accessible: true,
      accessibilityRole: role,
      accessibilityState: {
        checked: isChecked,
        disabled,
      },
      accessibilityLabel,
      accessibilityHint,
      testID,
    },
  };
}
