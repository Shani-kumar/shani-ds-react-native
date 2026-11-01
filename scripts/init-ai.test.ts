import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { initAi, SHANI_START_MARKER, SHANI_END_MARKER } from '../packages/ui/src/cli/init-ai';

describe('shani-ds init-ai (Step 5.6 Item 2)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shani-init-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('creates all 4 AI configuration files in an empty directory', () => {
    const result = initAi({ targetDir: tempDir });

    expect(result.created).toEqual(['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.cursorrules']);
    expect(result.updated).toEqual([]);

    for (const fileName of ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.cursorrules']) {
      const filePath = path.join(tempDir, fileName);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain(SHANI_START_MARKER);
      expect(content).toContain(SHANI_END_MARKER);
      expect(content).toContain('node_modules/@shani/ui/components.json');
      expect(content).toContain('node_modules/@shani/ui/AGENTS.md');
    }

    // Verify Claude import syntax
    const claudeContent = fs.readFileSync(path.join(tempDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeContent).toContain('@node_modules/@shani/ui/AGENTS.md');

    // Verify Gemini import syntax
    const geminiContent = fs.readFileSync(path.join(tempDir, 'GEMINI.md'), 'utf-8');
    expect(geminiContent).toContain('@./node_modules/@shani/ui/AGENTS.md');

    // Verify AGENTS.md full key rules
    const agentsContent = fs.readFileSync(path.join(tempDir, 'AGENTS.md'), 'utf-8');
    expect(agentsContent).toContain('Strict Prohibitions (NEVER)');
    expect(agentsContent).toContain('NEVER use raw hex codes');
  });

  it('appends to an existing file without overwriting user content', () => {
    const userClaudeHeader = '# My Custom Project Instructions\n\nDo not delete this.';
    fs.writeFileSync(path.join(tempDir, 'CLAUDE.md'), userClaudeHeader, 'utf-8');

    const result = initAi({ targetDir: tempDir });
    expect(result.updated).toContain('CLAUDE.md');

    const updatedContent = fs.readFileSync(path.join(tempDir, 'CLAUDE.md'), 'utf-8');
    expect(updatedContent.startsWith(userClaudeHeader)).toBe(true);
    expect(updatedContent).toContain(SHANI_START_MARKER);
    expect(updatedContent).toContain('@node_modules/@shani/ui/AGENTS.md');
  });

  it('updates Shani DS block idempotently when run multiple times', () => {
    initAi({ targetDir: tempDir });
    const run2 = initAi({ targetDir: tempDir });

    expect(run2.created).toEqual([]);
    expect(run2.updated).toEqual(['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.cursorrules']);

    for (const fileName of ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.cursorrules']) {
      const content = fs.readFileSync(path.join(tempDir, fileName), 'utf-8');
      const startMatches = content.match(new RegExp(SHANI_START_MARKER, 'g'));
      const endMatches = content.match(new RegExp(SHANI_END_MARKER, 'g'));
      expect(startMatches?.length).toBe(1);
      expect(endMatches?.length).toBe(1);
    }
  });
});

