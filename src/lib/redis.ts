import { createClient } from '@redis/client';

export const redis = createClient({
	url: process.env.REDIS_URL,
});

redis.on('error', (error) => console.log(error));

(async () => {
	if (!redis.isOpen) {
		await redis.connect();
	}
})();
