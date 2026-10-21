import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokensCss, buildDart, makeResolver, splitColours, THEMES } from '../src/tokens.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFile(path.join(ROOT,p),'utf8');
const write = async (p,s) => {await mkdir(path.dirname(path.join(ROOT,p)),{recursive:true});await writeFile(path.join(ROOT,p),s);};
const camel = name => name.replace(/-([a-z0-9])/g,(_,c)=>c.toUpperCase());
export async function buildPackages() {
  const tokens = JSON.parse(await read('source/tokens.json'));
  const messages = JSON.parse(await read('source/messages.json'));
  const {raw,semantic} = splitColours(tokens);
  const resolver = makeResolver(tokens);
  // Validate the complete graph before emitting any output; detect circular aliases.
  const entries = new Map(tokens.color.tokens.map(t=>[t.name,t]));
  function resolve(name,theme,stack=[]) {
    if(stack.includes(name)) throw new Error(`Circular token reference: ${[...stack,name].join(' -> ')}`);
    const token=entries.get(name);if(!token) throw new Error(`Unknown token ${name}`);
    const value=typeof token.value==='string'?token.value:token.value[theme];
    if(typeof value!=='string') throw new Error(`Missing ${theme} value for ${name}`);
    const match=/^\{([^}]+)\}$/.exec(value);return match?resolve(match[1],theme,[...stack,name]):value;
  }
  const values=Object.fromEntries(THEMES.map(theme=>[theme,Object.fromEntries(tokens.color.tokens.map(t=>[t.name,resolve(t.name,theme)]))]));
  const scalars=Object.fromEntries(['spacing','radius','duration','easing','zIndex'].map(group=>[group,Object.fromEntries(tokens[group].tokens.map(t=>[t.name,t.value]))]));
  const css=buildTokensCss(tokens);
  for(const pkg of ['tokens','core']) {await rm(path.join(ROOT,'packages',pkg,'dist'),{recursive:true,force:true});await mkdir(path.join(ROOT,'packages',pkg,'dist'),{recursive:true});}
  await write('packages/tokens/dist/styles.css',css);
  await write('packages/tokens/dist/tokens.json',JSON.stringify({themes:values,...scalars,fonts:tokens.type.families},null,2)+'\n');
  await write('packages/tokens/dist/index.js',`// Generated from source/tokens.json.\nexport const themes = ${JSON.stringify(values,null,2)};\nexport const foundations = ${JSON.stringify({...scalars,fonts:tokens.type.families},null,2)};\n`);
  const keys=tokens.color.tokens.map(t=>JSON.stringify(t.name)).join(' | ');
  await write('packages/tokens/dist/index.d.ts',`export type ThemeName = 'light' | 'dark' | 'black';\nexport type ColorToken = ${keys};\nexport declare const themes: Readonly<Record<ThemeName, Readonly<Record<ColorToken,string>>>>;\nexport declare const foundations: Readonly<Record<'spacing' | 'radius' | 'duration' | 'easing' | 'zIndex' | 'fonts', Readonly<Record<string,string>>>>;\n`);
  for(const theme of THEMES) {
    const dtcg={color:{},dimension:{},duration:{}};
    for(const t of tokens.color.tokens) {const c=resolver.colour(theme,t.name);dtcg.color[t.name]={$type:'color',$value:{colorSpace:'srgb',components:[c.r/255,c.g/255,c.b/255],alpha:c.a??1}};}
    for(const group of ['spacing','radius']) for(const t of tokens[group].tokens) dtcg.dimension[t.name]={$type:'dimension',$value:{value:parseFloat(t.value),unit:'px'}};
    for(const t of tokens.duration.tokens) dtcg.duration[t.name]={$type:'duration',$value:{value:parseFloat(t.value),unit:'ms'}};
    await write(`packages/tokens/dist/dtcg/${theme}.json`,JSON.stringify(dtcg,null,2)+'\n');
  }
  await write('packages/core/dist/tokens.css',css);
  await write('packages/core/dist/styles.css',await read('source/components/core.css'));
  await write('packages/core/dist/legacy.css',(await read('source/components/core.css')).replaceAll('cave-','cv-'));
  const messageSource=`// Generated from source/messages.json.\nexport const messages = ${JSON.stringify(messages,null,2)};\n`;
  await write('packages/core/src/messages.js',messageSource);
  for(const name of ['index.js','index.d.ts','messages.js']) await cp(path.join(ROOT,'packages/core/src',name),path.join(ROOT,'packages/core/dist',name));
  await write('packages/flutter/lib/src/tokens.dart',buildDart(tokens).replace('by design.cave.technology','by Cave UI'));
  const mapping=theme=>semantic.map(t=>`    '${t.name}': Cave${theme[0].toUpperCase()+theme.slice(1)}Colors.${camel(t.name)},`).join('\n');
  const colors=`// Generated. Edit source/tokens.json, then run npm run build:packages.\nimport 'package:flutter/material.dart';\nimport 'tokens.dart';\n\n@immutable\nclass CaveColors extends ThemeExtension<CaveColors> {\n  final Map<String,Color> _values;\n  const CaveColors(this._values);\n${THEMES.map(theme=>`  static const ${theme} = CaveColors({\n${mapping(theme)}\n  });`).join('\n')}\n${semantic.map(t=>`  Color get ${camel(t.name)} => _values['${t.name}']!;`).join('\n')}\n  @override\n  CaveColors copyWith({Map<String,Color>? values}) => CaveColors(Map.unmodifiable({..._values, ...?values}));\n  @override\n  CaveColors lerp(covariant CaveColors? other, double t) => other == null ? this : CaveColors({for (final key in _values.keys) key: Color.lerp(_values[key],other._values[key],t)!});\n}\n`;
  await write('packages/flutter/lib/src/colors.dart',colors);
  const dimensions=['spacing','radius'].map(group=>`abstract final class Cave${group[0].toUpperCase()+group.slice(1)} {\n${tokens[group].tokens.map(t=>`  static const double ${camel(t.name)} = ${parseFloat(t.value)};`).join('\n')}\n}\n`).join('\n');
  await write('packages/flutter/lib/src/dimensions.dart','// Generated from source/tokens.json.\n'+dimensions);
  await write('packages/flutter/lib/src/messages.dart',`// Generated from source/messages.json.\nconst caveMessages = <String, Map<String,String>>${JSON.stringify(messages,null,2)};\n`);
  return {version:JSON.parse(await read('packages/core/package.json')).version};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {const result=await buildPackages();console.log(`Built Web, token and Flutter packages ${result.version}`);}
