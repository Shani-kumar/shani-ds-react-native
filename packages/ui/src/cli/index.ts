import path from 'node:path';
import { runValidation } from './validate.js';
import { initAi } from './init-ai.js';

export * from './validate.js';
export * from './init-ai.js';

export function run(args: string[] = process.argv.slice(2)): void {
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    return;
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    console.log('0.1.0');
    return;
  }

  if (command === 'init-ai') {
    handleInitAi(args.slice(1));
    return;
  }

  if (command === 'validate') {
    handleValidate(args.slice(1));
    return;
  }

  console.error(`❌ Unknown command: '${command}'`);
  printHelp();
  process.exit(1);
}

function printHelp(): void {
  console.log(`
Shani Design System CLI (@shani/ui)

Usage:
  shani-ds <command> [options]

Commands:
  init-ai              Initialize AI configuration files in the project
                       (AGENTS.md, CLAUDE.md, GEMINI.md, .cursorrules)
  validate <path>      Validate screen file or folder against Shani DS rules

Options:
  -h, --help           Show this help message
  -v, --version        Show version number

Examples:
  npx shani-ds init-ai
  npx shani-ds validate src/screens/HomeScreen.tsx
  npx shani-ds validate src/screens/
`);
}

function handleInitAi(_args: string[]): void {
  try {
    const res = initAi();
    console.log('\n🤖 Initialized Shani DS AI configuration:');
    for (const f of res.created) {
      console.log(`  ✓ Created ${f}`);
    }
    for (const f of res.updated) {
      console.log(`  ✓ Updated ${f}`);
    }
    console.log('\n✅ AI layer initialized successfully.\n');
  } catch (err: unknown) {
    console.error('\n❌ Failed to initialize AI configuration:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

function handleValidate(args: string[]): void {
  const target = args[0];
  if (!target) {
    console.error('Usage: shani-ds validate <path> [--manifest <path>]');
    process.exit(1);
  }

  let customManifest: string | undefined;
  const manifestIdx = args.indexOf('--manifest');
  if (manifestIdx !== -1 && args[manifestIdx + 1]) {
    customManifest = args[manifestIdx + 1];
  }

  console.log(`\n🛡️  Validating screen code against Shani DS rules: ${target}\n`);

  try {
    const { totalFiles, totalViolations, results, manifestPath } = runValidation(target, customManifest);
    console.log(`  Using manifest: ${path.relative(process.cwd(), manifestPath) || manifestPath}\n`);

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
