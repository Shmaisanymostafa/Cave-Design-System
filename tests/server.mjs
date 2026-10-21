import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
export async function serve(directory) {
 const server=http.createServer(async(req,res)=>{try{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
  let file=path.resolve(directory,'.'+pathname);if(!file.startsWith(directory+path.sep)&&file!==directory)throw Error('Outside root');
  if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.woff2':'font/woff2','.ttf':'font/ttf','.svg':'image/svg+xml','.json':'application/json'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.statusCode=404;res.end('Not found');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {server,base:`http://127.0.0.1:${server.address().port}`};
}
