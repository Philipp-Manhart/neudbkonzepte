import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/lib/user-provider';
import { getSession } from '@/lib/session';
import { AuthToggle } from '@/components/auth-toggle';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/app-mode-toggle';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'PollPal',
	description: 'Erstelle Umfragen und teile sie mit deinen Freunden',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();
	const isLoggedIn = !!session?.userKey;
	const isAuthenticated = session?.userType === 'authenticated';

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<UserProvider userKey={session?.userKey} userType={session?.userType}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						{isAuthenticated ? (
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<div className="m-4">
										<header className="flex justify-between items-center">
											<SidebarTrigger />
											<div className="flex justify-between items-center gap-4">
												<AuthToggle isLoggedIn={isLoggedIn} />
												<ModeToggle />
											</div>
										</header>
										<main>
											<div className="m-4">{children}</div>
										</main>
									</div>
								</SidebarInset>
							</SidebarProvider>
						) : (
							<div className="m-4">
								<header className="flex justify-between items-center">
									<div></div>
									<div className="flex justify-between items-center gap-4">
										<AuthToggle isLoggedIn={isLoggedIn} />
										<ModeToggle />
									</div>
								</header>
								<main>{children}</main>
							</div>
						)}
						<Toaster />
					</ThemeProvider>
				</UserProvider>
			</body>
		</html>
	);
}
