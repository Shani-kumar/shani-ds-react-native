import { checkRules, syncRules } from './sync-rules';

describe('AI Rules Synchronization (Step 5.1)', () => {
  it('verifies that GEMINI.md, AGENTS.md, CLAUDE.md, and .cursorrules are in sync', () => {
    // Ensures rules:check passes
    const inSync = checkRules();
    expect(inSync).toBe(true);
  });

  it('syncRules writes valid content to all target files without throwing', () => {
    expect(() => syncRules()).not.toThrow();
  });
});

