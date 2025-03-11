'use client';

import { createContext, useContext } from 'react';

export interface UserContextType {
	userKey?: string;
	userType?: string;
}

export const UserContext = createContext<UserContextType>({ userKey: undefined, userType: undefined });

export function useUser() {
	return useContext(UserContext);
}
