import { useState, useCallback } from 'react';
import type { AccessibilityRole, AccessibilityState } from 'react-native';

export interface UseDisclosureOptions {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onToggle?: (isOpen: boolean) => void;
  role?: AccessibilityRole;
}

export interface UseDisclosureState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export interface TriggerProps {
  onPress: () => void;
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityState: AccessibilityState;
  'aria-expanded': boolean;
}

export interface TargetProps {
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityViewIsModal: boolean;
  accessibilityLiveRegion: 'polite' | 'assertive' | 'none';
  'aria-hidden': boolean;
}

export interface UseDisclosureReturn {
  state: UseDisclosureState;
  triggerProps: TriggerProps;
  targetProps: TargetProps;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Headless hook managing visibility states for expandable/collapsible surfaces (modals, sheets, accordions).
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const {
    isOpen: controlledIsOpen,
    defaultIsOpen = false,
    onOpen,
    onClose,
    onToggle,
    role = 'none',
  } = options;

  const [internalIsOpen, setInternalIsOpen] = useState(defaultIsOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(nextOpen);
      }
      onToggle?.(nextOpen);
      if (nextOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [isControlled, onToggle, onOpen, onClose]
  );

  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggle = useCallback(() => setIsOpen(!isOpen), [setIsOpen, isOpen]);

  return {
    state: {
      isOpen,
      open,
      close,
      toggle,
      setIsOpen,
    },
    triggerProps: {
      onPress: toggle,
      accessible: true,
      accessibilityRole: 'button',
      accessibilityState: {
        expanded: isOpen,
      },
      'aria-expanded': isOpen,
    },
    targetProps: {
      accessible: true,
      accessibilityRole: role,
      accessibilityViewIsModal: isOpen,
      accessibilityLiveRegion: 'polite',
      'aria-hidden': !isOpen,
    },
    open,
    close,
    toggle,
  };
}
