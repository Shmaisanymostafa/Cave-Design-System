import {chromium} from 'playwright';
import {mkdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import {serve} from './server.mjs';
const root=path.resolve('.artifacts/template-consumers');await rm(root,{recursive:true,force:true});await mkdir(root,{recursive:true});
for(const template of ['settings','dashboard','sign-in'])for(const lang of ['en','ar']){
 const name=`${template}_${lang}`;
 execFileSync('python3',['-c',"import zipfile,sys; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])",path.resolve(`dist/examples/templates/${name}.zip`),path.join(root,name)]);
}
const server=await serve(root),browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage(),errors=[],failed=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});page.on('request',request=>{if(request.url().startsWith('http')&&!request.url().startsWith(server.base))external.push(request.url());});
 for(const template of ['settings','dashboard','sign-in'])for(const lang of ['en','ar']){
  await page.goto(`${server.base}/${template}_${lang}/`);await page.locator('body[data-ready="true"]').waitFor({state:'attached'});
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  if(template==='settings'){await page.locator('#setting-numerals').selectOption('latn');assert.match(await page.locator('#formatted-number').textContent(),/12,345.67/);}
  if(template==='dashboard'){await page.locator('#order-search').fill('1043');assert.equal(await page.locator('[data-order]:visible').count(),1);}
  if(template==='sign-in'){await page.locator('[type="submit"]').click();assert.equal(await page.locator('#signin-email').getAttribute('aria-invalid'),'true');}
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
 console.log('PASS: all six extracted template ZIPs run independently under a subpath, without external requests or missing resources.');
}finally{await browser.close();server.server.close();}
