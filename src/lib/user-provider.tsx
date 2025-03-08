'use client';

import { ReactNode, useState } from 'react';
import { UserContext } from './context';

interface UserProviderProps {
	children: ReactNode;
	initialUser?: string;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
	const [user] = useState<string | undefined>(initialUser);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
