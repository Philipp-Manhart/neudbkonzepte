'use client';

import { ReactNode, useState, useEffect } from 'react';
import { UserContext } from './context';

interface UserProviderProps {
	children: ReactNode;
	userId?: string;
	userType?: string;
}

export function UserProvider({ children, userId, userType }: UserProviderProps) {
	const [userState, setUserState] = useState({
		userId,
		userType,
	});
	useEffect(() => {
		setUserState({ userId, userType });
	}, [userId, userType]);

	return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
}
