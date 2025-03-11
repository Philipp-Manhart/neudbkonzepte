'use client';

import { z } from 'zod';

export const SignupFormSchema = z.object({
	first_name: z.string().min(3, { message: 'Dein Vorname muss mindestens 3 Zeichen lang sein.' }),
	last_name: z.string().min(3, { message: 'Dein Nachname muss mindestens 3 Zeichen lang sein.' }),
	email: z.string().email({ message: 'Gib eine valide E-Mail Adresse ein' }).trim(),
	password: z
		.string()
		.min(8, { message: 'Muss mindestens 8 Zeichen lang sein.' })
		.regex(/[a-zA-Z]/, { message: 'Muss mindestens einen Buchstaben enthalten.' })
		.regex(/[0-9]/, { message: 'Muss mindestens eine Zahl enthalten.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Muss mindestens ein Soonderzeichen enthalten.',
		})
		.trim(),
});

export const SigninFormSchema = z.object({
	email: z.string().email({ message: 'Gib eine valide E-Mail Adresse ein' }).trim(),
	password: z.string().min(8, { message: 'Muss mindestens 8 Zeichen lang sein.' }).trim(),
});

export const EnterPollFormSchema = z.object({
	enterCode: z.string().length(6, { message: 'Der Beitrittscode besteht aus 6 Zeichen' }).trim(),
});
