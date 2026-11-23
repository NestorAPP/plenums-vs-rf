const CACHE_NAME = 'plenums-cache-v2'; // Обновили версию кэша

// Список файлов, которые нужно закэшировать при установке
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './data.js',
    './search-index.js',
    './mammoth.browser.min.js',
    './manifest.json',
    './icon-192.png',
];

// Динамически генерируем пути ко всем 92 документам
// Так как они называются plenum_01.docx ... plenum_92.docx (с пропусками)
const DOCS_TO_CACHE = [];
// Мы не можем знать точные номера, поэтому просто перечислим те, которые есть в data.js
// Но лучше сделать это вручную, зная пропуски (04, 06, 08, 09)
const existingDocs = [
    1, 2, 3, 5, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
    53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
    69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
    85, 86, 87, 88, 89, 90, 91, 92
];

existingDocs.forEach(num => {
    const paddedNum = num.toString().padStart(2, '0');
    DOCS_TO_CACHE.push(`./docs/plenum_${paddedNum}.docx`);
});

// 1. Установка
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Кэшируем основные файлы и все документы');
            // Сначала кэшируем основу (быстро), потом документы (долго)
            return cache.addAll(ASSETS_TO_CACHE).then(() => {
                return cache.addAll(DOCS_TO_CACHE);
            });
        })
    );
});

// 2. Активация
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Удаляем старый кэш:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Перехват запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                // Если файла нет в кэше, но он успешно загрузился, кэшируем его
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                console.log('Нет сети и нет в кэше для:', event.request.url);
            });
        })
    );
});
