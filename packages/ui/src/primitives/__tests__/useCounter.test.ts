import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../useCounter';

describe('useCounter Headless Hook', () => {
  it('manages numeric state with increment, decrement and limits', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useCounter({
        defaultValue: 2,
        min: 0,
        max: 4,
        step: 1,
        onChange,
      })
    );

    expect(result.current.value).toBe(2);
    expect(result.current.canIncrement).toBe(true);
    expect(result.current.canDecrement).toBe(true);

    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(3);
    expect(onChange).toHaveBeenCalledWith(3);

    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(4);
    expect(result.current.canIncrement).toBe(false);

    // Should not exceed max
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(4);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.value).toBe(3);
  });

  it('exposes accessible adjustable contract and handles accessibility actions', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useCounter({
        defaultValue: 5,
        min: 1,
        max: 10,
        step: 2,
        onChange,
      })
    );

    const { adjustableProps } = result.current;
    expect(adjustableProps.accessible).toBe(true);
    expect(adjustableProps.accessibilityRole).toBe('adjustable');
    expect(adjustableProps.accessibilityValue).toEqual({ min: 1, max: 10, now: 5 });
    expect(adjustableProps.accessibilityActions).toEqual([
      { name: 'increment' },
      { name: 'decrement' },
    ]);

    act(() => {
      adjustableProps.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } });
    });
    expect(result.current.value).toBe(7);

    act(() => {
      adjustableProps.onAccessibilityAction({ nativeEvent: { actionName: 'decrement' } });
    });
    expect(result.current.value).toBe(5);
  });

  it('supports controlled value', () => {
    const onChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useCounter({ value, min: 0, max: 10, onChange }),
      { initialProps: { value: 3 } }
    );

    expect(result.current.value).toBe(3);

    act(() => {
      result.current.increment();
    });
    expect(onChange).toHaveBeenCalledWith(4);
    expect(result.current.value).toBe(3);

    rerender({ value: 4 });
    expect(result.current.value).toBe(4);
  });

  it('disables interactions when disabled', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useCounter({ defaultValue: 5, disabled: true, onChange })
    );

    expect(result.current.canIncrement).toBe(false);
    expect(result.current.canDecrement).toBe(false);

    act(() => {
      result.current.increment();
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.value).toBe(5);
  });
});
