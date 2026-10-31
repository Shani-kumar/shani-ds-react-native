import { renderHook, act } from '@testing-library/react-native';
import { useToggle } from '../useToggle';

describe('useToggle Headless Hook', () => {
  it('operates uncontrolled with defaultChecked and toggle()', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useToggle({ defaultChecked: false, onChange, role: 'switch' })
    );

    expect(result.current.state.isChecked).toBe(false);
    expect(result.current.toggleProps.accessibilityRole).toBe('switch');
    expect(result.current.toggleProps.accessibilityState.checked).toBe(false);

    act(() => {
      result.current.toggleProps.onPress();
    });

    expect(result.current.state.isChecked).toBe(true);
    expect(result.current.toggleProps.accessibilityState.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);

    act(() => {
      result.current.state.toggle();
    });

    expect(result.current.state.isChecked).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('respects controlled checked prop', () => {
    const onChange = jest.fn();
    const { result, rerender } = renderHook(({ checked }) => useToggle({ checked, onChange }), {
      initialProps: { checked: false },
    });

    expect(result.current.state.isChecked).toBe(false);

    act(() => {
      result.current.toggleProps.onPress();
    });

    expect(onChange).toHaveBeenCalledWith(true);
    // Unchanged until parent updates prop
    expect(result.current.state.isChecked).toBe(false);

    rerender({ checked: true });
    expect(result.current.state.isChecked).toBe(true);
    expect(result.current.toggleProps.accessibilityState.checked).toBe(true);
  });

  it('disables interaction when disabled or readOnly', () => {
    const onChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ disabled, readOnly }) => useToggle({ disabled, readOnly, onChange }),
      { initialProps: { disabled: true, readOnly: false } }
    );

    act(() => {
      result.current.toggleProps.onPress();
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.state.isChecked).toBe(false);

    rerender({ disabled: false, readOnly: true });
    act(() => {
      result.current.toggleProps.onPress();
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
