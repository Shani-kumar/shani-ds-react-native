import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseCounterOptions {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export interface CounterAdjustableProps {
  accessible: boolean;
  accessibilityRole: 'adjustable';
  accessibilityValue: {
    min?: number;
    max?: number;
    now: number;
  };
  accessibilityActions: Array<{ name: 'increment' | 'decrement' }>;
  onAccessibilityAction: (event: { nativeEvent: { actionName: string } }) => void;
  accessibilityState: {
    disabled: boolean;
  };
}

export interface UseCounterReturn {
  value: number;
  setValue: (value: number) => void;
  increment: () => void;
  decrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
  adjustableProps: CounterAdjustableProps;
}

/**
 * Headless hook managing bounded numeric counter state with step increments,
 * limits clamping, and full accessible "adjustable" role contract.
 */
export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const {
    value: controlledValue,
    defaultValue,
    min = 0,
    max = Infinity,
    step = 1,
    onChange,
    disabled = false,
  } = options;

  const isControlled = controlledValue !== undefined;

  const clamp = useCallback(
    (val: number): number => {
      return Math.max(min, Math.min(max, val));
    },
    [min, max]
  );

  const [uncontrolledValue, setUncontrolledValue] = useState<number>(() => {
    const initial = defaultValue !== undefined ? defaultValue : min !== -Infinity ? min : 0;
    return Math.max(min, Math.min(max, initial));
  });

  const currentValue = isControlled ? clamp(controlledValue as number) : uncontrolledValue;

  const currentValueRef = useRef(currentValue);
  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const canIncrement = !disabled && currentValue + step <= max;
  const canDecrement = !disabled && currentValue - step >= min;

  const increment = useCallback(() => {
    if (disabled) return;
    const cur = currentValueRef.current;
    if (cur + step > max) return;
    const next = clamp(cur + step);
    if (!isControlled) {
      setUncontrolledValue(next);
      currentValueRef.current = next;
    }
    onChange?.(next);
  }, [disabled, max, step, clamp, isControlled, onChange]);

  const decrement = useCallback(() => {
    if (disabled) return;
    const cur = currentValueRef.current;
    if (cur - step < min) return;
    const next = clamp(cur - step);
    if (!isControlled) {
      setUncontrolledValue(next);
      currentValueRef.current = next;
    }
    onChange?.(next);
  }, [disabled, min, step, clamp, isControlled, onChange]);

  const setValue = useCallback(
    (newVal: number) => {
      if (disabled) return;
      const next = clamp(newVal);
      if (!isControlled) {
        setUncontrolledValue(next);
        currentValueRef.current = next;
      }
      onChange?.(next);
    },
    [disabled, clamp, isControlled, onChange]
  );

  const onAccessibilityAction = useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (disabled) return;
      if (event.nativeEvent.actionName === 'increment') {
        increment();
      } else if (event.nativeEvent.actionName === 'decrement') {
        decrement();
      }
    },
    [disabled, increment, decrement]
  );

  const adjustableProps: CounterAdjustableProps = {
    accessible: true,
    accessibilityRole: 'adjustable',
    accessibilityValue: {
      min: Number.isFinite(min) ? min : undefined,
      max: Number.isFinite(max) ? max : undefined,
      now: currentValue,
    },
    accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }],
    onAccessibilityAction,
    accessibilityState: {
      disabled: Boolean(disabled),
    },
  };

  return {
    value: currentValue,
    setValue,
    increment,
    decrement,
    canIncrement,
    canDecrement,
    adjustableProps,
  };
}
