export type FormState =
	| {
			errors?: {
				first_name?: string[];
				last_name?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;

export type UserType = 'authenticated' | 'anonymous';

export interface User {
	key: string;
	type: UserType;
	first_name?: string;
	last_name?: string;
	email?: string;
}

export interface Session {
	userKey: string;
	expiresAt: Date;
	userType: string;
}
