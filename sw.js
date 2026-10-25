const V='lector-v1';
const LOCAL=['./','./index.html','./manifest.webmanifest'];
const CDN=[
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js',
'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(V);
    await Promise.all(LOCAL.map(u=>c.add(u).catch(()=>{})));
    await Promise.all(CDN.map(u=>
      fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{})
    ));
    self.skipWaiting()
  })())
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==V).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()))
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(r=>{
      if(r)return r;
      return fetch(e.request).then(resp=>{
        const copy=resp.clone();
        caches.open(V).then(c=>c.put(e.request,copy)).catch(()=>{});
        return resp
      }).catch(()=>caches.match('./index.html'))
    })
  )
});
