import { renderHook, act } from '@testing-library/react-native';
import { useSelection } from '../useSelection';

describe('useSelection Headless Hook', () => {
  describe('single mode', () => {
    it('operates uncontrolled with defaultValue', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useSelection({
          mode: 'single',
          defaultValue: 'opt1',
          onChange,
        })
      );

      expect(result.current.selected).toBe('opt1');
      expect(result.current.isSelected('opt1')).toBe(true);
      expect(result.current.isSelected('opt2')).toBe(false);

      const itemProps = result.current.getItemProps('opt2');
      expect(itemProps.accessibilityRole).toBe('radio');
      expect(itemProps.accessibilityState.selected).toBe(false);
      expect(itemProps.accessibilityState.disabled).toBe(false);

      act(() => {
        itemProps.onPress();
      });

      expect(result.current.selected).toBe('opt2');
      expect(onChange).toHaveBeenCalledWith('opt2');
    });

    it('respects allowEmpty deselect in single mode', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useSelection({
          mode: 'single',
          defaultValue: 'opt1',
          allowEmpty: true,
          onChange,
        })
      );

      act(() => {
        result.current.getItemProps('opt1').onPress();
      });

      expect(result.current.selected).toBeNull();
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('supports controlled value', () => {
      const onChange = jest.fn();
      const { result, rerender } = renderHook(
        ({ value }) => useSelection({ mode: 'single', value, onChange }),
        { initialProps: { value: 'first' } }
      );

      expect(result.current.selected).toBe('first');

      act(() => {
        result.current.getItemProps('second').onPress();
      });

      expect(onChange).toHaveBeenCalledWith('second');
      // Remains controlled until rerender
      expect(result.current.selected).toBe('first');

      rerender({ value: 'second' });
      expect(result.current.selected).toBe('second');
      expect(result.current.getItemProps('second').accessibilityState.selected).toBe(true);
    });

    it('disables items when globally or locally disabled', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useSelection({ mode: 'single', defaultValue: 'a', disabled: true, onChange })
      );

      const props = result.current.getItemProps('b');
      expect(props.disabled).toBe(true);
      expect(props.accessibilityState.disabled).toBe(true);

      act(() => {
        props.onPress();
      });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('multiple mode', () => {
    it('handles multiple selections with checkbox accessibility role', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useSelection({
          mode: 'multiple',
          defaultValue: ['item1'],
          onChange,
        })
      );

      expect(result.current.selected).toEqual(['item1']);
      expect(result.current.getItemProps('item1').accessibilityRole).toBe('checkbox');
      expect(result.current.getItemProps('item1').accessibilityState.selected).toBe(true);

      act(() => {
        result.current.getItemProps('item2').onPress();
      });

      expect(result.current.selected).toEqual(['item1', 'item2']);
      expect(onChange).toHaveBeenCalledWith(['item1', 'item2']);

      act(() => {
        result.current.getItemProps('item1').onPress();
      });

      expect(result.current.selected).toEqual(['item2']);
      expect(onChange).toHaveBeenCalledWith(['item2']);
    });
  });
});
