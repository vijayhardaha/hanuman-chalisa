import { manifest, version } from "@parcel/service-worker";

async function install() {
	const cache = await caches.open(version);
	await cache.addAll(manifest);
}
addEventListener("install", (e) => e.waitUntil(install()));

async function activate() {
	const keys = await caches.keys();
	await Promise.all(keys.map((key) => key !== version && caches.delete(key)));
}
addEventListener("activate", (e) => e.waitUntil(activate()));

async function handleFetch(event) {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}

			const fetchRequest = event.request.clone();

			return fetch(fetchRequest).then((response) => {
				if (
					!response ||
					response.status !== 200 ||
					response.type !== "basic"
				) {
					return response;
				}

				const responseToCache = response.clone();

				caches.open(version).then((cache) => {
					cache.put(event.request, responseToCache);
				});

				return response;
			});
		})
	);
}
addEventListener("fetch", (event) => event.respondWith(handleFetch(event)));
