import fs from 'node:fs';
import path from 'node:path';

export const SOURCE_RULES_PATH = path.resolve(__dirname, '../docs/ai/rules.md');

export const TARGET_RULES_PATHS = [
  path.resolve(__dirname, '../GEMINI.md'),
  path.resolve(__dirname, '../AGENTS.md'),
  path.resolve(__dirname, '../CLAUDE.md'),
  path.resolve(__dirname, '../.cursorrules'),
  path.resolve(__dirname, '../packages/ui/AGENTS.md'),
];

export const SOURCE_DOCS_AI_DIR = path.resolve(__dirname, '../docs/ai');
export const PACKAGED_DOCS_DIR = path.resolve(__dirname, '../packages/ui/docs');

export function syncRules(): void {
  if (!fs.existsSync(SOURCE_RULES_PATH)) {
    throw new Error(`Source rules file not found: ${SOURCE_RULES_PATH}`);
  }

  const sourceContent = fs.readFileSync(SOURCE_RULES_PATH, 'utf-8');

  for (const targetPath of TARGET_RULES_PATHS) {
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, sourceContent, 'utf-8');
    const relative = path.relative(path.resolve(__dirname, '..'), targetPath);
    console.log(`✓ Synchronized ${relative}`);
  }

  // Sync docs/ai to packages/ui/docs
  if (fs.existsSync(SOURCE_DOCS_AI_DIR)) {
    if (!fs.existsSync(PACKAGED_DOCS_DIR)) {
      fs.mkdirSync(PACKAGED_DOCS_DIR, { recursive: true });
    }
    const docFiles = fs.readdirSync(SOURCE_DOCS_AI_DIR).filter((f) => f.endsWith('.md'));
    for (const file of docFiles) {
      const src = path.join(SOURCE_DOCS_AI_DIR, file);
      const dest = path.join(PACKAGED_DOCS_DIR, file);
      fs.copyFileSync(src, dest);
      console.log(`✓ Synchronized packages/ui/docs/${file}`);
    }
  }

  console.log('\n✅ All rules and packaged AI context synchronized with docs/ai');
}

export function checkRules(): boolean {
  if (!fs.existsSync(SOURCE_RULES_PATH)) {
    console.error(`❌ Source rules file missing: ${SOURCE_RULES_PATH}`);
    return false;
  }

  const sourceContent = fs.readFileSync(SOURCE_RULES_PATH, 'utf-8');
  let hasDiff = false;

  for (const targetPath of TARGET_RULES_PATHS) {
    const relative = path.relative(path.resolve(__dirname, '..'), targetPath);
    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Missing rules file: ${relative}`);
      hasDiff = true;
      continue;
    }

    const targetContent = fs.readFileSync(targetPath, 'utf-8');
    if (targetContent !== sourceContent) {
      console.error(`❌ Content drift detected in: ${relative}`);
      hasDiff = true;
    } else {
      console.log(`✓ In sync: ${relative}`);
    }
  }

  // Check packages/ui/docs
  if (fs.existsSync(SOURCE_DOCS_AI_DIR)) {
    const docFiles = fs.readdirSync(SOURCE_DOCS_AI_DIR).filter((f) => f.endsWith('.md'));
    for (const file of docFiles) {
      const src = path.join(SOURCE_DOCS_AI_DIR, file);
      const dest = path.join(PACKAGED_DOCS_DIR, file);
      if (!fs.existsSync(dest)) {
        console.error(`❌ Missing packaged AI doc: packages/ui/docs/${file}`);
        hasDiff = true;
        continue;
      }
      const srcContent = fs.readFileSync(src, 'utf-8');
      const destContent = fs.readFileSync(dest, 'utf-8');
      if (srcContent !== destContent) {
        console.error(`❌ Content drift detected in: packages/ui/docs/${file}`);
        hasDiff = true;
      } else {
        console.log(`✓ In sync: packages/ui/docs/${file}`);
      }
    }
  }

  if (hasDiff) {
    console.error('\n❌ Rules drift check failed. Run `pnpm sync:rules` to regenerate copies.');
    return false;
  }

  console.log('\n✅ All rules files and packaged AI docs are identical to docs/ai');
  return true;
}

if (require.main === module) {
  const isCheck = process.argv.includes('--check');
  if (isCheck) {
    const ok = checkRules();
    process.exit(ok ? 0 : 1);
  } else {
    syncRules();
  }
}

