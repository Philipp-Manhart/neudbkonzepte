'use server';
import { redis } from '@/lib/redis';

export async function getUser(userKey: string) {
	try {
		const userData = await redis.hGetAll(userKey);

		if (!userData || Object.keys(userData).length === 0) {
			return { success: false, error: 'Benutzer nicht vorhanden' };
		}

		return {
			success: true,
			userKey,
			...userData,
		};
	} catch (error) {
		console.error('Fehler beim Abrufen des Benutzers:', error);
		return { success: false, error: 'Abrufen des Benutzers fehlgeschlagen' };
	}
}

export async function updateUser(userKey: string, first_name: string, last_name: string, email: string) {
	try {
		// Validate userKey
		if (!userKey || typeof userKey !== 'string') {
			console.error('Invalid userKey:', userKey);
			return { success: false, error: 'Ungültiger Benutzer-Schlüssel' };
		}

		const originalEmail = await redis.hGet(userKey, 'email');

		// Validate fields
		if (!first_name || !last_name || !email) {
			return { success: false, error: 'Alle Felder müssen ausgefüllt sein' };
		}

		const multi = redis.multi();
		multi.hSet(userKey, {
			first_name,
			last_name,
			email,
		});

		if (originalEmail && email !== originalEmail) {
			multi.del(`user:email:${originalEmail}`);
			multi.set(`user:email:${email}`, userKey);
		}

		await multi.exec();
		return { success: true, userKey };
	} catch (error) {
		console.error('Fehler beim Aktualisieren des Benutzers:', error);
		return { success: false, error: 'Aktualisierung des Benutzers fehlgeschlagen' };
	}
}
