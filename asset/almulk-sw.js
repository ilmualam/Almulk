const CACHE="almulk-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll([])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener("fetch",e=>{
  const u=e.request.url;
  const ok=/api\.alquran\.cloud|almulk\.json|almulk\.min\.js|\.mp3($|\?)/.test(u);
  if(!ok) return;
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;
    }).catch(()=>hit))
  );
});
