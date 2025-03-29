'use server';

import { redis } from '@/lib/redis';
import { createSession, deleteSession } from '@/lib/session';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// Signup
export async function signupAuthenticated(first_name: string, last_name: string, email: string, password: string) {
	const type = 'authenticated';
	const uniqueId = nanoid();
	const userKey = `user:${uniqueId}`;

	const emailKey = `user:email:${email}`;
	const userExists = await redis.exists(emailKey);

	if (userExists) {
		return { success: false, error: 'Nutzer mit dieser E-Mail existiert bereits' };
	} else {
		const hashedPassword = await bcrypt.hash(password, 10);

		const multi = redis.multi();
		multi.hSet(userKey, {
			type,
			first_name,
			last_name,
			email,
			password: hashedPassword,
		});
		multi.set(emailKey, userKey);
		await multi.exec();

		await createSession(userKey, type);

		const cookieStore = await cookies();
		const redirectUrl = cookieStore.get('redirectUrl')?.value;

		if (redirectUrl) {
			cookieStore.delete('redirectUrl');
			redirect(redirectUrl);
		} else {
			redirect('/');
		}
	}
}

export async function signupAnonymous() {
	const type = 'anonymous';
	const uniqueId = nanoid();
	const userKey = `user:${uniqueId}`;

	await redis.hSet(userKey, {
		type,
	});

	await createSession(userKey, type);

	const cookieStore = await cookies();
	const redirectUrl = cookieStore.get('redirectUrl')?.value;

	if (redirectUrl) {
		cookieStore.delete('redirectUrl');
		redirect(redirectUrl);
	} else {
		redirect('/');
	}
}

// Login / Logout
export async function login(email: string, password: string) {
	const userKey = await redis.get(`user:email:${email}`);

	if (!userKey) {
		return { success: false, error: 'Ungültige E-Mail oder Passwort' };
	}

	const user = await redis.hGetAll(userKey);

	if (!user || Object.keys(user).length === 0) {
		return { success: false, error: 'Benutzerdaten nicht gefunden' };
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (passwordMatch) {
		await createSession(userKey, user.type);

		const cookieStore = await cookies();
		const redirectUrl = cookieStore.get('redirectUrl')?.value;

		if (redirectUrl) {
			cookieStore.delete('redirectUrl');
			redirect(redirectUrl);
		} else {
			redirect('/');
		}
	} else {
		return { success: false, error: 'Ungültige E-Mail oder Passwort' };
	}
}

export async function logout() {
	await deleteSession();
	redirect('/login');
}

// Change Password
export async function changePassword(userKey: string, confirmation_password: string, new_password: string) {
	try {
		const password = await redis.hGet(userKey, 'password');

		if (!password) {
			return { success: false, error: 'Nutzer Password nicht gefunden' };
		}

		const passwordMatch = await bcrypt.compare(confirmation_password, password);

		if (passwordMatch) {
			const hashedPassword = await bcrypt.hash(new_password, 10);
			await redis.hSet(userKey, {
				password: hashedPassword,
			});
			return { success: true };
		}
		return { success: false, error: 'Überprüfe dein altes Password' };
	} catch (error) {
		console.error('Fehler beim Ändern des Passworts:', error);
		return { success: false, error: 'Änderung des Passworts fehlgeschlagen' };
	}
}
