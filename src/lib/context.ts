'use client';

import { createContext, useContext } from 'react';

export interface UserContextType {
	userId?: string;
	userType?: string;
}

export const UserContext = createContext<UserContextType>({ userId: undefined, userType: undefined });

export function useUser() {
	return useContext(UserContext);
}
