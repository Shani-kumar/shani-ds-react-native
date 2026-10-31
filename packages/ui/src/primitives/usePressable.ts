import { useState, useCallback } from 'react';
import type { GestureResponderEvent, AccessibilityRole, AccessibilityState } from 'react-native';

export interface UsePressableOptions {
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface UsePressableState {
  isPressed: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isLoading: boolean;
}

export interface PressableProps {
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
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

export interface UsePressableReturn {
  state: UsePressableState;
  pressableProps: PressableProps;
}

/**
 * Headless hook managing press interactions, hover/focus states, and accessibility props.
 * Pure logic and behavior with ZERO styling opinions.
 */
export function usePressable(options: UsePressableOptions = {}): UsePressableReturn {
  const {
    onPress,
    onLongPress,
    disabled = false,
    loading = false,
    accessibilityRole = 'button',
    accessibilityLabel,
    accessibilityHint,
    testID,
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || loading;

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled) return;
      onPress?.(event);
    },
    [isDisabled, onPress]
  );

  const handleLongPress = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled) return;
      onLongPress?.(event);
    },
    [isDisabled, onLongPress]
  );

  const handlePressIn = useCallback((_event: GestureResponderEvent) => {
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback((_event: GestureResponderEvent) => {
    setIsPressed(false);
  }, []);

  const handleHoverIn = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleHoverOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    state: {
      isPressed,
      isHovered,
      isFocused,
      isDisabled,
      isLoading: loading,
    },
    pressableProps: {
      onPress: handlePress,
      onLongPress: handleLongPress,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      onHoverIn: handleHoverIn,
      onHoverOut: handleHoverOut,
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled: isDisabled,
      accessible: true,
      accessibilityRole,
      accessibilityState: {
        disabled: isDisabled,
        busy: loading,
      },
      accessibilityLabel,
      accessibilityHint,
      testID,
    },
  };
}
