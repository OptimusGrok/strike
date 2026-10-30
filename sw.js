// Strike service worker: same-origin only. Never touches Supabase or any cross-origin request (leaderboard stays live).
const CACHE='strike-v15';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('strike-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;const u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
  const doc=r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
  if(doc){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;})));});
