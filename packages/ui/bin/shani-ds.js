#!/usr/bin/env node
/* eslint-disable */

/**
 * Shani Design System CLI
 *
 * Provides developer tooling for consumer repositories:
 * - `shani-ds init-ai`: Generates agent configuration files (AGENTS.md, CLAUDE.md, GEMINI.md, .cursorrules)
 * - `shani-ds validate <path>`: Validates screen code against Shani DS rules and components.json
 */

const path = require('node:path');

process.env.SHANI_PACKAGE_ROOT = path.resolve(__dirname, '..');
process.env.SHANI_MANIFEST_PATH = path.resolve(__dirname, '../components.json');

async function main() {
  try {
    const cli = await import('../dist/cli/index.js');
    cli.run(process.argv.slice(2));
  } catch (err) {
    console.error('❌ Failed to run @shani/ui CLI:', err);
    process.exit(1);
  }
}

main();
