'use server';
import { redis } from '@/lib/redis';

export async function getUser(userId: string) {
	const first_name = await redis.hGet(userId, 'first_name');
	const last_name = await redis.hGet(userId, 'last_name');
	const email = await redis.hGet(userId, 'email');
	return {
		first_name,
		last_name,
		email,
	};
}

export async function updateUser(userId: string, first_name: string, last_name: string, email: string) {
	const originalEmail = await redis.hGet(userId, 'email');
	await redis.hSet(userId, {
		first_name,
		last_name,
		email,
	});

	if (originalEmail && email !== originalEmail) {
		await redis.del(`user:email:${originalEmail}`);
		await redis.set(`user:email:${email}`, userId);
	}
}
