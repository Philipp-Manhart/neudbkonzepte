'use server';

import { redis } from '@/lib/redis';
import { createSession, deleteSession } from '@/lib/session';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function signupAuthenticated(first_name: string, last_name: string, email: string, password: string) {
	const type = 'authenticated';
	const uniqueId = nanoid();

	const emailKey = `user:email:${email}`;
	const userExists = await redis.exists(emailKey);

	if (userExists) {
		return { success: false, error: 'User with this email already exists' };
	} else {
		const userId = `user:${uniqueId}`;
		const hashedPassword = await bcrypt.hash(password, 10);

		await redis.hSet(userId, {
			type,
			first_name,
			last_name,
			email,
			password: hashedPassword,
		});

		await redis.set(emailKey, uniqueId);

		await createSession(uniqueId);
		redirect('/dashboard');
	}
}

export async function signupAnonymous() {
	const type = 'anonymous';
	const uniqueId = nanoid();

	const userId = `user:${uniqueId}`;
	await redis.hSet(userId, {
		type,
	});

	await createSession(uniqueId);
	redirect('/dashboard');
}

export async function login(email: string, password: string) {
	const userId = await redis.get(`user:email:${email}`);

	if (!userId) {
		return { success: false, error: 'Invalid email or password' };
	}

	const user = await redis.hGetAll(`user:${userId}`);

	if (!user || Object.keys(user).length === 0) {
		return { success: false, error: 'User data not found' };
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (passwordMatch) {
		await createSession(userId);
		redirect('/dashboard');
	} else {
		return { success: false, error: 'Invalid email or password' };
	}
}

export async function logout() {
	await deleteSession();
	redirect('/login');
}
