import { useState, useCallback } from 'react';
import type { AccessibilityRole, AccessibilityState } from 'react-native';

export type SelectionMode = 'single' | 'multiple';

export interface UseSelectionItemOptions {
  disabled?: boolean;
}

export interface SelectionItemProps {
  onPress: () => void;
  selected: boolean;
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityState: AccessibilityState;
  disabled: boolean;
}

export interface UseSelectionBaseOptions {
  mode?: SelectionMode;
  disabled?: boolean;
  allowEmpty?: boolean;
}

export interface UseSingleSelectionOptions<T = string> extends UseSelectionBaseOptions {
  mode?: 'single';
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
}

export interface UseMultipleSelectionOptions<T = string> extends UseSelectionBaseOptions {
  mode: 'multiple';
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
}

export type UseSelectionOptions<T = string> =
  | UseSingleSelectionOptions<T>
  | UseMultipleSelectionOptions<T>;

export interface UseSelectionReturn<T = string> {
  selected: T | null | T[];
  isSelected: (value: T) => boolean;
  select: (value: T) => void;
  toggle: (value: T) => void;
  setSelected: (value: T | T[] | null) => void;
  getItemProps: (value: T, itemOptions?: UseSelectionItemOptions) => SelectionItemProps;
}

/**
 * Headless selection hook supporting single and multiple selection modes,
 * controlled and uncontrolled state, and ARIA radio/checkbox accessibility contracts.
 */
export function useSelection<T = string>(
  options: UseMultipleSelectionOptions<T>
): UseSelectionReturn<T> & { selected: T[] };
export function useSelection<T = string>(
  options?: UseSingleSelectionOptions<T>
): UseSelectionReturn<T> & { selected: T | null };
export function useSelection<T = string>(
  options: UseSelectionOptions<T> = {}
): UseSelectionReturn<T> {
  const { mode = 'single', disabled = false, allowEmpty = false } = options;

  const isMultiple = mode === 'multiple';
  const isControlled = options.value !== undefined;

  const [uncontrolledSingle, setUncontrolledSingle] = useState<T | null>(
    () => (options.defaultValue as T | null) ?? null
  );
  const [uncontrolledMultiple, setUncontrolledMultiple] = useState<T[]>(
    () => (options.defaultValue as T[]) ?? []
  );

  const currentSingle = isControlled
    ? (options.value as T | null) ?? null
    : uncontrolledSingle;

  const currentMultiple = isControlled
    ? (options.value as T[]) ?? []
    : uncontrolledMultiple;

  const isSelected = useCallback(
    (itemValue: T): boolean => {
      if (isMultiple) {
        return currentMultiple.includes(itemValue);
      }
      return currentSingle === itemValue;
    },
    [isMultiple, currentMultiple, currentSingle]
  );

  const toggle = useCallback(
    (itemValue: T) => {
      if (disabled) return;

      if (isMultiple) {
        const next = currentMultiple.includes(itemValue)
          ? currentMultiple.filter((v) => v !== itemValue)
          : [...currentMultiple, itemValue];

        if (!isControlled) {
          setUncontrolledMultiple(next);
        }
        (options as UseMultipleSelectionOptions<T>).onChange?.(next);
      } else {
        const isCurrent = currentSingle === itemValue;
        let next: T | null = itemValue;

        if (isCurrent) {
          if (allowEmpty) {
            next = null;
          } else {
            return;
          }
        }

        if (!isControlled) {
          setUncontrolledSingle(next);
        }
        (options as UseSingleSelectionOptions<T>).onChange?.(next);
      }
    },
    [disabled, isMultiple, currentMultiple, currentSingle, allowEmpty, isControlled, options]
  );

  const select = toggle;

  const setSelected = useCallback(
    (val: T | T[] | null) => {
      if (disabled) return;

      if (isMultiple) {
        const next = Array.isArray(val) ? (val as T[]) : [];
        if (!isControlled) {
          setUncontrolledMultiple(next);
        }
        (options as UseMultipleSelectionOptions<T>).onChange?.(next);
      } else {
        const next = Array.isArray(val) ? (val[0] ?? null) : (val as T | null);
        if (!isControlled) {
          setUncontrolledSingle(next);
        }
        (options as UseSingleSelectionOptions<T>).onChange?.(next);
      }
    },
    [disabled, isMultiple, isControlled, options]
  );

  const getItemProps = useCallback(
    (itemValue: T, itemOptions?: UseSelectionItemOptions): SelectionItemProps => {
      const itemDisabled = Boolean(disabled || itemOptions?.disabled);
      const active = isSelected(itemValue);
      const role: AccessibilityRole = isMultiple ? 'checkbox' : 'radio';

      return {
        onPress: () => {
          if (!itemDisabled) {
            toggle(itemValue);
          }
        },
        selected: active,
        accessible: true,
        accessibilityRole: role,
        accessibilityState: {
          selected: active,
          disabled: itemDisabled,
        },
        disabled: itemDisabled,
      };
    },
    [disabled, isMultiple, isSelected, toggle]
  );

  return {
    selected: isMultiple ? currentMultiple : currentSingle,
    isSelected,
    select,
    toggle,
    setSelected,
    getItemProps,
  };
}
