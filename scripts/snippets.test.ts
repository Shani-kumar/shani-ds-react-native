import { checkAllSnippets } from './check-snippets';

describe('Gallery code snippets typecheck', () => {
  const { totalSnippets, results } = checkAllSnippets();

  it('found all 12 component code snippets', () => {
    expect(totalSnippets).toBe(12);
  });

  results.forEach(({ file, diagnostics }) => {
    it(`snippet in ${file} must have 0 TypeScript type errors`, () => {
      expect(diagnostics).toEqual([]);
    });
  });
});

