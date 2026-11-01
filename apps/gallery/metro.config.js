const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo (packages/tokens, packages/ui)
config.watchFolders = [monorepoRoot];

// 2. Resolve packages from app node_modules then root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Resolve monorepo package source directly so gallery does not depend on packaged dist
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@shani/ui') {
    return {
      filePath: path.resolve(monorepoRoot, 'packages/ui/src/index.ts'),
      type: 'sourceFile',
    };
  }
  if (moduleName === '@shani/tokens') {
    return {
      filePath: path.resolve(monorepoRoot, 'packages/tokens/src/index.ts'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

