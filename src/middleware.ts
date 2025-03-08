import { NextRequest, NextResponse } from 'next/server';
import { refreshSession, getSession } from './lib/session';

const protectedRoutes = ['/profile', '/dashboard', '/profile/edit'];
const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
	const isPublicRoute = publicRoutes.some((route) => path === route);

	const session = await getSession();

	if (session?.userId) {
		await refreshSession(session.userId);
	}

	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	if (isPublicRoute && session?.userId) {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
