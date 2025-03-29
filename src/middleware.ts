import { NextRequest, NextResponse } from 'next/server';
import { refreshSession, getSession } from './lib/session';

const protectedRoutes = [
	'/profile',
	'/poll',
	'/profile/edit',
	'/create',
	'/my-polls',
	'/my-participations',
	'/polls/[id]',
	'/participate/[id]',
	'/participate',
	


];
const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
	const isPublicRoute = publicRoutes.some((route) => path === route);

	const session = await getSession();

	if (session?.userKey) {
		await refreshSession(session?.userKey, session?.userType);

		// Check if there's a saved redirect URL in cookies
		const redirectUrl = req.cookies.get('redirectUrl')?.value;
		if (isPublicRoute && redirectUrl) {
			// Clear the redirect cookie
			const response = NextResponse.redirect(new URL(redirectUrl, req.url));
			response.cookies.delete('redirectUrl');
			return response;
		}

		// Regular authenticated redirect from public routes (like login)
		if (isPublicRoute) {
			return NextResponse.redirect(new URL('/', req.url));
		}
	} else if (isProtectedRoute) {
		// Save the current URL before redirecting to login
		const redirectUrl = new URL('/login', req.url);
		const response = NextResponse.redirect(redirectUrl);

		// Store the original URL to redirect back after login
		response.cookies.set({
			name: 'redirectUrl',
			value: req.nextUrl.pathname + req.nextUrl.search,
			path: '/',
			httpOnly: true,
			maxAge: 60 * 30, // 30 minutes
			sameSite: 'lax',
		});

		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
