import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function files(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())result.push(...await files(path));else result.push(path)}return result}
const paths=(await files('dist')).filter(p=>!p.endsWith('sw.js'));
const hash=createHash('sha256');for(const p of paths)hash.update(await readFile(p));const version=hash.digest('hex').slice(0,12);
const urls=['/',...paths.filter(p=>!p.includes('/guides/')).map(p=>p.replace('dist',''))];
const guideUrls=paths.filter(p=>p.includes('/guides/')).map(p=>p.replace('dist',''));
await writeFile('dist/sw.js',`const CACHE='aliskan-${version}';const URLS=${JSON.stringify(urls)};const GUIDES=${JSON.stringify(guideUrls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(URLS))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('aliskan-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
if(req.mode==='navigate'){event.respondWith(fetch(req).catch(()=>caches.match('/index.html')));return;}
if(GUIDES.includes(url.pathname)){event.respondWith(caches.open(CACHE).then(cache=>cache.match(req).then(hit=>hit||fetch(req).then(response=>{if(response.ok)event.waitUntil(cache.put(req,response.clone()).catch(()=>{}));return response}))));return;}
if(URLS.includes(url.pathname))event.respondWith(caches.match(url.pathname).then(hit=>hit||fetch(req)));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.matchAll({type:'window'}).then(clients=>clients.length?clients[0].focus():self.clients.openWindow('/')))});
`);
console.log(`PWA cache: ${urls.length} assets, version ${version}`);
