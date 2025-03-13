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

export interface Poll{
	pollId: string;
	owner: string;
	name: string;
	description: string;
	questionCount: number;
	defaultduration: string;
}

export interface QuestionData {
	questionId: string;
	type: QuestionType | null;
	questionText: string;
	options: string[] | null;
	error: string | null;
}

export type QuestionType = 'multiple-choice' | 'single-choice' | 'yes-no' | 'scale';

