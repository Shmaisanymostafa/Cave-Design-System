import {execFileSync} from 'node:child_process';
import {mkdir,cp,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {buildPackages} from './build-packages.mjs';
import {buildExamples} from './build-examples.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await buildPackages();await buildExamples();
execFileSync('flutter',['build','web','--no-web-resources-cdn','--no-wasm-dry-run','--base-href','/flutter-preview/'],{cwd:path.join(root,'packages/flutter/example'),stdio:'inherit'});
await mkdir(path.join(root,'.artifacts'),{recursive:true});
for(const target of ['.artifacts/flutter-preview','dist/flutter-preview']){await rm(path.join(root,target),{recursive:true,force:true});await cp(path.join(root,'packages/flutter/example/build/web'),path.join(root,target),{recursive:true});}
console.log('Built local Flutter gallery. Nothing was published or deployed.');
