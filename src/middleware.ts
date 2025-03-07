import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt, refreshSession } from './lib/session';

const protectedRoutes = ['/test', '/profile', '/dashboard'];
const authRoutes = ['/login', '/signup', '/register'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
	const isAuthRoute = authRoutes.some((route) => path === route);

	const cookie = (await cookies()).get('session')?.value;
	const session = await decrypt(cookie);

	if (session?.userId) {
		await refreshSession(session.userId);
	}

	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	if (isAuthRoute && session?.userId) {
		return NextResponse.redirect(new URL('/test', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|public).*)',
	],
};
