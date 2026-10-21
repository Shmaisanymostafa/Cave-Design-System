import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../source/catalog.mjs';
import {configuredCode,playgroundState} from '../source/playground.mjs';
import {templates,flutterTemplate} from '../source/templates.mjs';
test('untrusted query values cannot become executable preview code',()=>{
 const state=playgroundState(new URLSearchParams('variant=%3Cscript%3E&locale=unknown&theme=unknown&direction=javascript&state=unknown'));
 assert.equal(state.variant,'primary');assert.equal(state.locale,'en');assert.equal(state.direction,'auto');
});
test('configured Web and Flutter source preserve the same button intent',()=>{
 const c=catalog.find(c=>c.name==='Button');const sample=configuredCode(c,'ar',{variant:'danger',state:'loading',size:'lg',direction:'ltr',numerals:'latn',theme:'black',label:'long'});
 assert.match(sample.html,/cave-btn--danger cave-btn--lg/);assert.match(sample.html,/disabled aria-busy="true"/);assert.match(sample.dart,/CaveButtonVariant.danger/);assert.match(sample.dart,/loading: true/);assert.match(sample.dart,/CaveButtonSize.large/);assert.match(sample.js,/numberingSystem: 'latn'/);assert.match(sample.dart,/direction: TextDirection.ltr/);
});
test('templates include complete source and never submit to a service',()=>{
 for(const template of templates)for(const lang of ['en','ar']){const sample=template.example(lang);assert.ok(sample.html);assert.ok(sample.js);assert.match(flutterTemplate(template,lang),/void main\(/);assert.doesNotMatch(sample.js,/fetch\(|XMLHttpRequest|localStorage/);}
});
