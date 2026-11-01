import fs from 'node:fs';
import path from 'node:path';

export const SOURCE_RULES_PATH = path.resolve(__dirname, '../docs/ai/rules.md');

export const TARGET_RULES_PATHS = [
  path.resolve(__dirname, '../GEMINI.md'),
  path.resolve(__dirname, '../AGENTS.md'),
  path.resolve(__dirname, '../CLAUDE.md'),
  path.resolve(__dirname, '../.cursorrules'),
];

export function syncRules(): void {
  if (!fs.existsSync(SOURCE_RULES_PATH)) {
    throw new Error(`Source rules file not found: ${SOURCE_RULES_PATH}`);
  }

  const sourceContent = fs.readFileSync(SOURCE_RULES_PATH, 'utf-8');

  for (const targetPath of TARGET_RULES_PATHS) {
    fs.writeFileSync(targetPath, sourceContent, 'utf-8');
    const relative = path.relative(path.resolve(__dirname, '..'), targetPath);
    console.log(`✓ Synchronized ${relative}`);
  }

  console.log('\n✅ All rules files synchronized with docs/ai/rules.md');
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

  if (hasDiff) {
    console.error('\n❌ Rules drift check failed. Run `pnpm sync:rules` to regenerate copies.');
    return false;
  }

  console.log('\n✅ All rules files are identical to docs/ai/rules.md');
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

