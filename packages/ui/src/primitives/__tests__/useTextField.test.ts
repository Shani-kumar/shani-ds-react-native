import { renderHook, act } from '@testing-library/react-native';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useTextField } from '../useTextField';

const mockFocusEvent = {} as NativeSyntheticEvent<TextInputFocusEventData>;

describe('useTextField Headless Hook', () => {
  it('handles uncontrolled text input and clear()', () => {
    const onChangeText = jest.fn();
    const { result } = renderHook(() => useTextField({ defaultValue: 'initial', onChangeText }));

    expect(result.current.state.value).toBe('initial');
    expect(result.current.inputProps.value).toBe('initial');
    expect(result.current.inputProps.editable).toBe(true);

    act(() => {
      result.current.inputProps.onChangeText('updated text');
    });

    expect(result.current.state.value).toBe('updated text');
    expect(onChangeText).toHaveBeenCalledWith('updated text');

    act(() => {
      result.current.clear();
    });

    expect(result.current.state.value).toBe('');
    expect(onChangeText).toHaveBeenCalledWith('');
  });

  it('manages focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { result } = renderHook(() => useTextField({ onFocus, onBlur }));

    expect(result.current.state.isFocused).toBe(false);

    act(() => {
      result.current.inputProps.onFocus(mockFocusEvent);
    });
    expect(result.current.state.isFocused).toBe(true);
    expect(onFocus).toHaveBeenCalled();

    act(() => {
      result.current.inputProps.onBlur(mockFocusEvent);
    });
    expect(result.current.state.isFocused).toBe(false);
    expect(onBlur).toHaveBeenCalled();
  });

  it('reflects error state and error message in accessibility hints', () => {
    const { result, rerender } = renderHook(({ error }) => useTextField({ error }), {
      initialProps: { error: 'Invalid tracking number' as string | boolean },
    });

    expect(result.current.state.hasError).toBe(true);
    expect(result.current.state.errorMessage).toBe('Invalid tracking number');
    expect(result.current.inputProps.accessibilityHint).toBe('Invalid tracking number');

    rerender({ error: false });
    expect(result.current.state.hasError).toBe(false);
    expect(result.current.state.errorMessage).toBeUndefined();
  });

  it('disables input when disabled or readOnly', () => {
    const onChangeText = jest.fn();
    const { result, rerender } = renderHook(
      ({ disabled, readOnly }) =>
        useTextField({ defaultValue: 'test', disabled, readOnly, onChangeText }),
      { initialProps: { disabled: true, readOnly: false } }
    );

    expect(result.current.inputProps.editable).toBe(false);

    act(() => {
      result.current.inputProps.onChangeText('blocked');
    });
    expect(onChangeText).not.toHaveBeenCalled();

    rerender({ disabled: false, readOnly: true });
    expect(result.current.inputProps.editable).toBe(false);
    act(() => {
      result.current.inputProps.onChangeText('blocked-readonly');
    });
    expect(onChangeText).not.toHaveBeenCalled();
  });
});
