'use client';

import { createContext, useContext } from 'react';

// Create a context with undefined as default value
export const UserContext = createContext<string | undefined>(undefined);

// Custom hook to use the UserContext
export function useUser() {
	return useContext(UserContext);
}
