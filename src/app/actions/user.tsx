'use server';
import { redis } from '@/lib/redis';

export async function getUser(userId: string) {
	const userKey = `user:${userId}`;
	const first_name = await redis.hGet(userKey, 'first_name');
	const last_name = await redis.hGet(userKey, 'last_name');
	const email = await redis.hGet(userKey, 'email');
	return {
		first_name,
		last_name,
		email,
	};
}

export async function updateUser(userId: string, first_name: string, last_name: string, email: string) {
	const originalEmail = await redis.hGet(userId, 'email');

	const multi = redis.multi();
	multi.hSet(userId, {
		first_name,
		last_name,
		email,
	});

	if (originalEmail && email !== originalEmail) {
		multi.del(`user:email:${originalEmail}`);
		multi.set(`user:email:${email}`, userId);
	}

	await multi.exec();
}
