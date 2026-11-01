import path from 'node:path';
import { runValidation, ScreenValidator, type Violation, type ValidationResult } from '../packages/ui/src/cli/validate';

export { runValidation, ScreenValidator, type Violation, type ValidationResult };

if (require.main === module) {
  const target = process.argv[2];

  if (!target) {
    console.error('Usage: pnpm validate:screen <file or folder>');
    console.error('Example: pnpm validate:screen apps/gallery/app/demos');
    process.exit(1);
  }

  console.log(`\n🛡️  Validating screen code against Shani DS rules: ${target}\n`);

  try {
    const { totalFiles, totalViolations, results } = runValidation(target);

    for (const res of results) {
      const relPath = path.relative(process.cwd(), res.file);
      if (res.valid) {
        console.log(`  ✓ ${relPath} (0 violations)`);
      } else {
        console.error(`\n  ✗ ${relPath} (${res.violations.length} violation${res.violations.length > 1 ? 's' : ''}):`);
        for (const v of res.violations) {
          console.error(`    Line ${v.line}:${v.column} [${v.category}] ${v.message}`);
          console.error(`      ↳ Hint: ${v.hint}`);
        }
      }
    }

    if (totalViolations > 0) {
      console.error(`\n❌ Validation failed: ${totalViolations} violation(s) found across ${totalFiles} file(s).\n`);
      process.exit(1);
    } else {
      console.log(`\n✅ Validation passed: ${totalFiles} file(s) cleanly adhere to Shani DS rules.\n`);
      process.exit(0);
    }
  } catch (err: unknown) {
    console.error('\n❌ Execution error during screen validation:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
