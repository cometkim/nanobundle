#!/usr/bin/env node

import meow from 'meow';

export const cli = meow(`
Usage
  $ nanobundle <command> [options]

Available Commands
  build    Build once and exit

Options
  --version          Display current version

  --cwd              Use an alternative working directory

  --root-dir         Specify the path to resolve source entry (default: ./src)
                     This can be overriden by tsconfig.json

  --out-dir          Specify the path to resolve source entry (default: .)
                     This can be overriden by tsconfig.json

  --tsconfig         Specify the path to a custom tsconfig.json

  --import-maps      Specify import map file path  (default: package.json)

  --standalone       Embed external dependencies into the bundle (default: false)

  --external         Specify external dependencies to exclude from the bundle

  --minify           Minify production output (default: true)

  --sourcemap        Generate source map (default: true)

  --dts              Generate TypeScript .d.ts files (default: true)

  --help             Display this message
`, {
  importMeta: import.meta,
  flags: {
    cwd: {
      type: 'string',
      default: process.cwd(),
    },
    rootDir: {
      type: 'string',
      default: 'src',
    },
    outDir: {
      type: 'string',
      default: '.',
    },
    tsconfig: {
      type: 'string',
      default: 'tsconfig.json',
    },
    importMaps: {
      type: 'string',
      default: 'package.json',
    },
    external: {
      type: 'string',
      isMultiple: true,
      default: [],
    },
    standalone: {
      type: 'boolean',
      default: false,
    },
    minify: {
      type: 'boolean',
      default: true,
    },
    sourcemap: {
      type: 'boolean',
      default: true,
    },
    dts: {
      type: 'boolean',
      default: true,
    },
  },
});

export type Flags = typeof cli.flags;
