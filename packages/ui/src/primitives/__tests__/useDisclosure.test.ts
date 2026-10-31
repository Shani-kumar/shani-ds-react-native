import { renderHook, act } from '@testing-library/react-native';
import { useDisclosure } from '../useDisclosure';

describe('useDisclosure Headless Hook', () => {
  it('handles default closed state and opening/closing', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const onToggle = jest.fn();

    const { result } = renderHook(() =>
      useDisclosure({ defaultIsOpen: false, onOpen, onClose, onToggle })
    );

    expect(result.current.state.isOpen).toBe(false);
    expect(result.current.triggerProps.accessibilityState.expanded).toBe(false);
    expect(result.current.targetProps['aria-hidden']).toBe(true);

    act(() => {
      result.current.open();
    });

    expect(result.current.state.isOpen).toBe(true);
    expect(result.current.triggerProps.accessibilityState.expanded).toBe(true);
    expect(result.current.targetProps['aria-hidden']).toBe(false);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.state.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('toggles visibility via triggerProps.onPress', () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: false }));

    act(() => {
      result.current.triggerProps.onPress();
    });
    expect(result.current.state.isOpen).toBe(true);

    act(() => {
      result.current.triggerProps.onPress();
    });
    expect(result.current.state.isOpen).toBe(false);
  });

  it('respects controlled isOpen prop', () => {
    const onToggle = jest.fn();
    const { result, rerender } = renderHook(({ isOpen }) => useDisclosure({ isOpen, onToggle }), {
      initialProps: { isOpen: false },
    });

    expect(result.current.state.isOpen).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(onToggle).toHaveBeenCalledWith(true);
    // State remains false until controlled prop updates
    expect(result.current.state.isOpen).toBe(false);

    rerender({ isOpen: true });
    expect(result.current.state.isOpen).toBe(true);
    expect(result.current.targetProps.accessibilityViewIsModal).toBe(true);
  });
});
