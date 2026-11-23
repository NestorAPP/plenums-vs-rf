const CACHE_NAME = 'plenums-cache-v1';

// Список файлов, которые нужно закэшировать при установке
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './data.js',
    './search-index.js',
    './mammoth.browser.min.js',
    './manifest.json',
    './icon-192.png',
    // Мы не перечисляем все 92 файла вручную. 
    // Они будут кэшироваться "на лету", когда пользователь их открывает.
];

// 1. Установка Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Активируем сразу, не ждем закрытия вкладок
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Кэшируем основные файлы');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Активация (удаление старого кэша, если обновилась версия)
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

// 3. Перехват запросов (Стратегия: Cache First, Network Fallback)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Если файл есть в кэше — отдаем его (работает офлайн)
            if (cachedResponse) {
                return cachedResponse;
            }

            // Если файла нет в кэше — идем в сеть
            return fetch(event.request).then((networkResponse) => {
                // Если запрос успешный, сохраняем его в кэш для будущего офлайна
                // (особенно важно для файлов из папки docs/)
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Если сети нет и файла нет в кэше — выводим заглушку или ничего не делаем
                console.log('Нет сети и нет в кэше для:', event.request.url);
            });
        })
    );
});
