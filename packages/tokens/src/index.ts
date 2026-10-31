export * from './generated/types';
export { lightTheme } from './generated/light';
export { darkTheme } from './generated/dark';
import tokensData from './generated/tokens.json';

export const primitives = tokensData.primitives;
export const tokensJson = tokensData;
