self.addEventListener('install', (e) => {
    console.log('SW installed');
    e.waitUntil( 
        caches.open('static')
            .then((cache) => {
                cache.addAll([
                    '/',
                    'index.html',
                    'beep.mp3',
                    'Rounded_Elegance.ttf',
                    'style.css',
                    'script.js'
                ]);
            })
    );
    
})

self.addEventListener('activate', () => {
    console.log('SW activates');
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((res)=>{
                if(res){
                    return res;
                } else {
                    fetch(e.request)
                }
            })
    );
})