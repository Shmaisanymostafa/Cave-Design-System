import {mkdir,writeFile,readFile,cp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {templates,flutterTemplate} from '../source/templates.mjs';
import {previewPage} from '../src/examples.mjs';
export async function buildTemplates(root,out){
 const dest=path.join(out,'examples/templates');await mkdir(dest,{recursive:true});
 for(const template of templates)for(const lang of ['en','ar']){
  await writeFile(path.join(out,`previews/${lang}/${template.name}.html`),previewPage(template,lang));
  await writeFile(path.join(out,`examples/flutter/${template.slug}_${lang}.dart`),flutterTemplate(template,lang));
  const stage=path.join(root,'.artifacts/template-stage');await rm(stage,{recursive:true,force:true});await mkdir(path.join(stage,'assets'),{recursive:true});
  await writeFile(path.join(stage,'index.html'),previewPage(template,lang).replaceAll('"/assets/','"./assets/'));
  for(const file of ['core','tokens.css','fonts.css','fonts','catalog.mjs','templates.mjs','playground.mjs','preview.js'])await cp(path.join(out,'assets',file),path.join(stage,'assets',file),{recursive:true});
  const fontCss=path.join(stage,'assets/fonts.css');await writeFile(fontCss,(await readFile(fontCss,'utf8')).replaceAll('/assets/fonts/','./fonts/'));
  await cp(path.join(root,'packages/LICENSE'),path.join(stage,'LICENSE'));
  await writeFile(path.join(stage,'README.md'),`# ${template.title.en}\n\nLocal ${lang} UI template. No server, authentication or external runtime dependency.\n\nRun \`python3 -m http.server 8000\` in this folder, then open http://localhost:8000. ES modules require HTTP; do not open index.html as a file URL.\n\nEdit assets/templates.mjs to change the template and assets/core/styles.css to customize layout. Optional fonts have their own OFL notices. The package source remains in the design repository.\n\nDemo data is never submitted or stored. Connect your own application services when adapting this template.\n`);
  execFileSync('python3',['-c',"import pathlib,sys,zipfile; root=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],'w',zipfile.ZIP_DEFLATED); [z.write(p,p.relative_to(root)) for p in sorted(root.rglob('*')) if p.is_file()]; z.close()",stage,path.join(dest,`${template.slug}_${lang}.zip`)]);
  await rm(stage,{recursive:true,force:true});
 }
}
