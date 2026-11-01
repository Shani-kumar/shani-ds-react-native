import { checkAllSnippets } from './check-snippets';

describe('Design system code snippets typecheck', () => {
  const { totalSnippets, results } = checkAllSnippets();

  it('found all 19 component code snippets', () => {
    expect(totalSnippets).toBe(19);
  });

  results.forEach(({ file, diagnostics }) => {
    it(`snippet in ${file} must have 0 TypeScript type errors`, () => {
      expect(diagnostics).toEqual([]);
    });
  });
});

