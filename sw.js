//----------------------------------------Crear una constante con el nombre me sirve para refactorizar
const NOMBRE_CACHE = 'caches';
//----------------------------------------Guardo todos los archivos a cachear en una constante - Se llama refactorizar
const LISTA_ARCHIVOS_GUARDADOS = [
    '/',
    'script.js',
    'sw.js',
    'loading.gif',
    'css/estilos.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://api.sampleapis.com/simpsons/episodes'
];


//----------------------------------------Service Worker
self.addEventListener('install', (e) => {
    console.log("soy un Sw. Me estoy instalando!");
    // Si agrego acá return; no hace el cache

    e.waitUntil(
        caches.has(NOMBRE_CACHE).then(instalado => {
            if (!instalado) {
                return caches.open(NOMBRE_CACHE).then(cache => {
                    cache.addAll(LISTA_ARCHIVOS_GUARDADOS);
                })
            }
        })
    );
})


self.addEventListener('activate', () => {
    console.log("Sw activado");
})



//----------------------------------------cache only
self.addEventListener('fetch-only', (e) => {
    const consulta = e.request;
    const respuestaCacheada = caches.match(consulta).then((respuesta) => {
        if (respuesta) return respuesta;
        return fetch(consulta).then((respuesta) => {
            return respuesta;
        })
    })
    e.respondWith(respuestaCacheada);
})



//----------------------------------------cache dinamico
self.addEventListener('fetch', (e) => {
    console.log("cache dinamico")
    const consulta = e.request;
    const respuestaCacheada = caches.match(consulta).then(async (respuesta) => {
        if(respuesta) return respuesta;
        const nuevaRespuesta = await fetch(consulta)
        const cache = await caches.open(NOMBRE_CACHE)
        await cache.put(consulta, nuevaRespuesta.clone())
        return nuevaRespuesta;
    })
    e.respondWith(respuestaCacheada);
})