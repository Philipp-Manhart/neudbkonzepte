import 'server-only';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { Session } from './definitions';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function createSession(userKey: string, userType: string) {
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
	const session = await encrypt({ userKey, expiresAt, userType });

	(await cookies()).set('session', session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		expires: expiresAt,
		path: '/',
	});
}

export async function refreshSession(userKey: string, userType: string) {
	await createSession(userKey, userType);
}

export async function getSession() {
	const cookie = (await cookies()).get('session')?.value;
	const session = await decrypt(cookie);
	return session;
}

export async function deleteSession() {
	(await cookies()).delete('session');
}

export async function encrypt(payload: Session) {
	return new SignJWT(payload as unknown as JWTPayload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('10m')
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<Session | undefined> {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		});
		return payload as unknown as Session;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return undefined;
	}
}
