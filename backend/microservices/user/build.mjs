import esbuild from 'esbuild'
import fs from 'fs/promises'
import { glob } from 'glob'
import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const microserviceDir = path.join(currentDir);
const sharedDir = path.join(currentDir, '../../shared');

const microserviceFiles = await glob(`${microserviceDir}/**/src/**/*.ts`, { ignore: 'node_modules/**' })
const sharedFiles = await glob(`${sharedDir}/**/*.ts`, { ignore: '../../shared/node_modules/**' })

const allFiles = [...microserviceFiles, ...sharedFiles]

const pkg = await fs.readFile('package.json').then(JSON.parse)
const externalPackages = pkg.dependencies && pkg.devDependencies
  ? [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
  : pkg.dependencies
    ? [...Object.keys(pkg.dependencies)] 
    : pkg.devDependencies
      ? [...Object.keys(pkg.devDependencies)]
      : []

const result = await esbuild.build({
  entryPoints: allFiles,
  bundle: true,
  outdir: './dist',
  metafile: true,
  external: externalPackages,
  jsx: 'automatic',
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  banner: {
    js: [
      `import { createRequire as topLevelCreateRequire } from 'module';`,
      `global.require = topLevelCreateRequire(import.meta.url);`,
    ].join('\n'),
  },
  outExtension: {
    '.js': '.mjs',
  },
})
console.log('Built')
