import { useState, useCallback } from 'react';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  AccessibilityState,
} from 'react-native';

export interface UseTextFieldOptions {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean | string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface UseTextFieldState {
  value: string;
  isFocused: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  hasError: boolean;
  errorMessage?: string;
  setValue: (value: string) => void;
  clear: () => void;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  editable: boolean;
  accessible: boolean;
  accessibilityState: AccessibilityState;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface UseTextFieldReturn {
  state: UseTextFieldState;
  inputProps: InputProps;
  clear: () => void;
}

/**
 * Headless hook managing text input value state, focus state, and validation accessibility.
 */
export function useTextField(options: UseTextFieldOptions = {}): UseTextFieldReturn {
  const {
    value: controlledValue,
    defaultValue = '',
    onChangeText,
    onFocus,
    onBlur,
    disabled = false,
    readOnly = false,
    required = false,
    error,
    accessibilityLabel,
    accessibilityHint,
    testID,
  } = options;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  const setValue = useCallback(
    (text: string) => {
      if (disabled || readOnly) return;
      if (!isControlled) {
        setInternalValue(text);
      }
      onChangeText?.(text);
    },
    [disabled, readOnly, isControlled, onChangeText]
  );

  const clear = useCallback(() => {
    setValue('');
  }, [setValue]);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return {
    state: {
      value,
      isFocused,
      isDisabled: disabled,
      isReadOnly: readOnly,
      isRequired: required,
      hasError,
      errorMessage,
      setValue,
      clear,
    },
    inputProps: {
      value,
      onChangeText: setValue,
      onFocus: handleFocus,
      onBlur: handleBlur,
      editable: !disabled && !readOnly,
      accessible: true,
      accessibilityState: {
        disabled,
        // Using 'busy' or custom properties for accessibility
      },
      accessibilityLabel,
      accessibilityHint: errorMessage ?? accessibilityHint,
      testID,
    },
    clear,
  };
}
