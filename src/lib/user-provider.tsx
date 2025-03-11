'use client';

import { ReactNode, useState, useEffect } from 'react';
import { UserContext } from './context';

interface UserProviderProps {
	children: ReactNode;
	userKey?: string;
	userType?: string;
}

export function UserProvider({ children, userKey, userType }: UserProviderProps) {
	const [userState, setUserState] = useState({
		userKey,
		userType,
	});
	useEffect(() => {
		setUserState({ userKey, userType });
	}, [userKey, userType]);

	return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
}
