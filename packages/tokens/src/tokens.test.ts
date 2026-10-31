import { lightTheme } from './generated/light';
import { darkTheme } from './generated/dark';

describe('Design Tokens Integration', () => {
  it('loads valid light and dark themes with matching structural keys', () => {
    expect(lightTheme.mode).toBe('light');
    expect(darkTheme.mode).toBe('dark');

    expect(Object.keys(lightTheme.colors.bg)).toEqual(Object.keys(darkTheme.colors.bg));
    expect(Object.keys(lightTheme.colors.text)).toEqual(Object.keys(darkTheme.colors.text));
    expect(Object.keys(lightTheme.colors.border)).toEqual(Object.keys(darkTheme.colors.border));
    expect(Object.keys(lightTheme.colors.action)).toEqual(Object.keys(darkTheme.colors.action));
  });

  it('contains no unresolved token references (curly braces) in light theme', () => {
    const json = JSON.stringify(lightTheme);
    const unparsedMatch = json.match(/\{[a-zA-Z0-9_.-]+\}/g);
    expect(unparsedMatch).toBeNull();
  });

  it('contains no unresolved token references (curly braces) in dark theme', () => {
    const json = JSON.stringify(darkTheme);
    const unparsedMatch = json.match(/\{[a-zA-Z0-9_.-]+\}/g);
    expect(unparsedMatch).toBeNull();
  });

  it('adheres to strict 4pt grid in spacing tokens', () => {
    const spaces = Object.values(lightTheme.spacing);
    spaces.forEach(val => {
      expect(typeof val).toBe('number');
      expect(val % 4).toBe(0);
    });
  });

  it('has valid component tokens mapped to semantic colors', () => {
    expect(lightTheme.components.button.primary.bg).toBe(lightTheme.colors.action.primary.default);
    expect(lightTheme.components.input.border.error).toBe(lightTheme.colors.border.danger);
    expect(lightTheme.components.switch.track.bgActive).toBe(
      lightTheme.colors.action.primary.default
    );
    expect(darkTheme.components.button.primary.bg).toBe(darkTheme.colors.action.primary.default);
  });
});
