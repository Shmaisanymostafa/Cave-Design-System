import { execFileSync } from 'node:child_process';
import { mkdir, rm, cp, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function packPackages() {
  const out=path.join(ROOT,'.artifacts');await mkdir(out,{recursive:true});
  const artifacts=[];
  for(const name of ['tokens','core']) {
    const result=JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',out],{cwd:path.join(ROOT,'packages',name),encoding:'utf8',env:{...process.env,npm_config_cache:path.join(ROOT,'.cache/npm')}}))[0];
    if(result.files.some(f=>!['package.json','README.md','LICENSE'].includes(f.path)&&!f.path.startsWith('dist/'))) throw new Error('Unexpected npm package file');
    artifacts.push({name:`@cave-ui/${name}`,file:result.filename});
  }
  const stage=path.join(out,'cave_ui');await rm(stage,{recursive:true,force:true});await mkdir(stage,{recursive:true});
  for(const file of ['lib','example','test','pubspec.yaml','README.md','LICENSE','CHANGELOG.md']) await cp(path.join(ROOT,'packages/flutter',file),path.join(stage,file),{recursive:true,filter:source=>!['build','.dart_tool','pubspec.lock'].includes(path.basename(source))});
  const version=JSON.parse(await readFile(path.join(ROOT,'packages/core/package.json'),'utf8')).version;
  const archive=`cave_ui-${version}.tar.gz`;await rm(path.join(out,archive),{force:true});
  execFileSync('tar',['-czf',path.join(out,archive),'--exclude=.dart_tool','--exclude=build','--exclude=pubspec.lock','cave_ui'],{cwd:out,env:{...process.env,COPYFILE_DISABLE:'1'}});
  await rm(stage,{recursive:true,force:true});artifacts.push({name:'cave_ui',file:archive});
  await writeFile(path.join(out,'manifest.json'),JSON.stringify(artifacts,null,2)+'\n');
  return artifacts;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) console.log(await packPackages());
