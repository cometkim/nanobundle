#!/usr/bin/env node

import { performance } from 'node:perf_hooks';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cli } from './cli';
import { loadConfig } from './config';
import { loadTargets } from './target';
import type { Reporter } from './report';
import { getEntriesFromConfig } from './entry';
import { buildCommand } from './commands/build';

const { flags, input } = cli;
const [command] = input;

const basePath = flags.cwd;

const reporter: Reporter = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};

const resolver = (file: string) => path.resolve(basePath, file);

let exitCode = 0;

switch (command) {
  case undefined: {
    cli.showHelp(0);
  }

  case 'build': {
    const startedAt = performance.now();

    const config = await loadConfig({ basePath });
    const sourceFile = config.source && resolver(config.source);
    if (!sourceFile || !fs.existsSync(sourceFile)) {
      throw new Error('`"source"` field must be specified in the package.json');
    }

    const targets = await loadTargets({ basePath });

    const entries = getEntriesFromConfig(config, {
      sourceFile,
      reporter,
      resolvePath: resolver,
    });

    const externalDependencies = [
      ...(config.dependencies ? Object.keys(config.dependencies) : []),
      ...(config.peerDependencies ? Object.keys(config.peerDependencies) : []),
    ];

    exitCode = await buildCommand({
      reporter,
      sourceFile,
      entries,
      targets,
      externalDependencies,
      minify: flags.minify,
      sourcemap: flags.sourcemap,
    })

    const endedAt = performance.now();
    const elapsedTime = endedAt - startedAt;
    reporter.info(`\n⚡ Done in ${(elapsedTime).toFixed(1)}ms.`);

    break;
  }

  case 'watch': {
    reporter.error('sorry, not implemeted yet');
    exitCode = 1;
    break;
  }

  default: {
    reporter.error(`
  Command "${command}" is not available.

  Run \`nanobundle --help\` for more detail.`,
    );
    exitCode = 1;
  }
}

process.exit(exitCode);
