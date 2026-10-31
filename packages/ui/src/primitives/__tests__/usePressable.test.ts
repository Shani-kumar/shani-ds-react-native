import { renderHook, act } from '@testing-library/react-native';
import type { GestureResponderEvent } from 'react-native';
import { usePressable } from '../usePressable';

const mockEvent = {} as GestureResponderEvent;

describe('usePressable Headless Hook', () => {
  it('initializes with default states', () => {
    const { result } = renderHook(() => usePressable());

    expect(result.current.state.isPressed).toBe(false);
    expect(result.current.state.isHovered).toBe(false);
    expect(result.current.state.isFocused).toBe(false);
    expect(result.current.state.isDisabled).toBe(false);
    expect(result.current.state.isLoading).toBe(false);

    expect(result.current.pressableProps.accessible).toBe(true);
    expect(result.current.pressableProps.accessibilityRole).toBe('button');
    expect(result.current.pressableProps.accessibilityState.disabled).toBe(false);
  });

  it('triggers onPress and toggles press state through press in/out', () => {
    const onPress = jest.fn();
    const { result } = renderHook(() => usePressable({ onPress }));

    act(() => {
      result.current.pressableProps.onPressIn(mockEvent);
    });
    expect(result.current.state.isPressed).toBe(true);

    act(() => {
      result.current.pressableProps.onPressOut(mockEvent);
    });
    expect(result.current.state.isPressed).toBe(false);

    act(() => {
      result.current.pressableProps.onPress?.(mockEvent);
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('prevents onPress when disabled or loading', () => {
    const onPress = jest.fn();
    const { result, rerender } = renderHook(
      ({ disabled, loading }) => usePressable({ onPress, disabled, loading }),
      { initialProps: { disabled: true, loading: false } }
    );

    expect(result.current.state.isDisabled).toBe(true);
    expect(result.current.pressableProps.accessibilityState.disabled).toBe(true);

    act(() => {
      result.current.pressableProps.onPress?.(mockEvent);
    });
    expect(onPress).not.toHaveBeenCalled();

    // Check loading state
    rerender({ disabled: false, loading: true });
    expect(result.current.state.isDisabled).toBe(true);
    expect(result.current.state.isLoading).toBe(true);
    expect(result.current.pressableProps.accessibilityState.busy).toBe(true);

    act(() => {
      result.current.pressableProps.onPress?.(mockEvent);
    });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('handles hover and focus state transitions', () => {
    const { result } = renderHook(() => usePressable());

    act(() => {
      result.current.pressableProps.onHoverIn();
    });
    expect(result.current.state.isHovered).toBe(true);

    act(() => {
      result.current.pressableProps.onHoverOut();
    });
    expect(result.current.state.isHovered).toBe(false);

    act(() => {
      result.current.pressableProps.onFocus();
    });
    expect(result.current.state.isFocused).toBe(true);

    act(() => {
      result.current.pressableProps.onBlur();
    });
    expect(result.current.state.isFocused).toBe(false);
  });
});
