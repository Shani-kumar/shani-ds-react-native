import { checkAllSnippets } from './check-snippets';

describe('Design system code snippets typecheck', () => {
  const { totalSnippets, results } = checkAllSnippets();

  it('found all 22 component code snippets', () => {
    expect(totalSnippets).toBe(22);
  });

  results.forEach(({ file, diagnostics }) => {
    it(`snippet in ${file} must have 0 TypeScript type errors`, () => {
      expect(diagnostics).toEqual([]);
    });
  });
});

