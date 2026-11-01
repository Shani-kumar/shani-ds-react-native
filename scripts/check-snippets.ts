import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export interface SnippetCheckResult {
  file: string;
  diagnostics: string[];
}

export function checkAllSnippets(): {
  totalSnippets: number;
  results: SnippetCheckResult[];
  hasErrors: boolean;
} {
  const compDir = path.resolve(__dirname, '../apps/gallery/app/components');
  const files = fs.readdirSync(compDir).filter((f) => f.endsWith('.tsx'));

  const tsconfigPath = path.resolve(__dirname, '../apps/gallery/tsconfig.json');
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsconfigPath),
  );

  const snippets = new Map<string, string>();
  const rootNames: string[] = [];
  const fileToVirtual = new Map<string, string>();

  for (const file of files) {
    const fullPath = path.join(compDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const match = content.match(/codeSnippet={`([\s\S]*?)`}/);
    if (match && match[1]) {
      const virtualPath = path.resolve(__dirname, `../apps/gallery/src/__snippet_${file}`);
      snippets.set(virtualPath, match[1]);
      rootNames.push(virtualPath);
      fileToVirtual.set(file, virtualPath);
    }
  }

  const host = ts.createCompilerHost(parsedConfig.options);
  const origGetSourceFile = host.getSourceFile;
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const resolved = path.resolve(fileName);
    if (snippets.has(resolved)) {
      return ts.createSourceFile(fileName, snippets.get(resolved)!, languageVersion);
    }
    return origGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  };

  const program = ts.createProgram(rootNames, parsedConfig.options, host);

  const results: SnippetCheckResult[] = [];
  let hasErrors = false;

  for (const file of files) {
    const virtualPath = fileToVirtual.get(file);
    if (!virtualPath) continue;

    const sourceFile = program.getSourceFile(virtualPath);
    const diags = sourceFile ? ts.getPreEmitDiagnostics(program, sourceFile) : [];
    const messages = diags.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));

    if (messages.length > 0) {
      hasErrors = true;
    }

    results.push({
      file,
      diagnostics: messages,
    });
  }

  return {
    totalSnippets: rootNames.length,
    results,
    hasErrors,
  };
}

if (require.main === module) {
  console.log('🔍 Checking gallery component code snippets against TypeScript definitions...\n');
  const { totalSnippets, results, hasErrors } = checkAllSnippets();

  for (const res of results) {
    if (res.diagnostics.length === 0) {
      console.log(`  ✓ ${res.file}`);
    } else {
      console.error(`  ✗ ${res.file}`);
      for (const diag of res.diagnostics) {
        console.error(`    - ${diag}`);
      }
    }
  }

  if (hasErrors) {
    console.error(`\n❌ Snippet typecheck failed for one or more components.`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${totalSnippets} component code snippets passed typecheck with 0 errors.\n`);
  }
}
