'use client';

import { LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';

export function AuthToggle({ isAuthenticated }: { isAuthenticated: boolean }) {
	const router = useRouter();

	const handleLogin = () => {
		router.push('/login');
	};

	const handleLogout = async () => {
		await logout();
	};

	return (
		<Button variant="ghost" onClick={isAuthenticated ? handleLogout : handleLogin}>
			{isAuthenticated ? <LogOut className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
			{isAuthenticated ? 'Logout' : 'Login'}
		</Button>
	);
}
