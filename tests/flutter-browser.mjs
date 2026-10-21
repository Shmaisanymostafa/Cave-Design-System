import {chromium,firefox,webkit} from 'playwright';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['scripts/serve.mjs','0'],{stdio:['ignore','pipe','inherit']});
const [chunk]=await once(server.stdout,'data'),base=chunk.toString().trim();
console.log('Preview server:',base);
try{
 for(const engine of (process.env.CAVE_BROWSERS||'chromium').split(',')){
  console.log('Native gallery browser:',engine);
  const browser=await ({chromium,firefox,webkit}[engine]).launch({headless:true});
  try{
   const page=await browser.newPage({viewport:{width:1200,height:1000}});page.setDefaultTimeout(60000);
   const requests=[],errors=[],failed=[];page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${base}/components/button?platform=flutter&locale=ar&theme=black&variant=danger&size=lg&label=long`);
   await page.locator('[data-playground][data-ready="true"]').waitFor();
   assert.equal(requests.some(url=>url.includes('/flutter-preview/')),false,'Flutter must not load until requested');
   console.log('Loading native gallery');await page.locator('#load-flutter').click();
   const frame=page.frameLocator('iframe.flutter-preview');
   const button=frame.getByRole('button',{name:'حفظ جميع التغييرات ومتابعة إعداد الحساب',exact:true});await button.waitFor();await page.locator('iframe.flutter-preview').scrollIntoViewIfNeeded();await button.click();
   await frame.getByText('تم حفظ التغييرات',{exact:true}).last().waitFor();
   await page.locator('#preview-language').selectOption('en');await frame.getByRole('button',{name:'Save all changes and continue setting up your account',exact:true}).waitFor();
   await page.screenshot({path:`.artifacts/flutter-${engine}.png`,fullPage:false});
   await page.goto(`${base}/templates/settings?platform=flutter&locale=ar&theme=dark`);await page.locator('#load-flutter').click();
   await page.frameLocator('iframe.flutter-preview').getByText('إعدادات الحساب',{exact:true}).waitFor();
   const external=requests.filter(url=>url.startsWith('http')&&!url.startsWith(base));assert.deepEqual(external,[],'Preview fonts and rendering resources must be local');assert.deepEqual(errors,[]);assert.deepEqual(failed,[],'No local preview resources should be missing');
   console.log(`PASS ${engine}: Flutter loads on demand, renders bilingual source, runs native actions and uses local resources.`);
  }finally{await browser.close();}
 }
}finally{server.kill();}
