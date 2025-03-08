import { object, string, z } from 'zod';

export const signInSchema = object({
	email: string({ required_error: 'E-Mail ist erforderlich' })
		.min(1, 'E-Mail ist erforderlich')
		.email('Ungültige E-Mail-Adresse'),
	password: string({ required_error: 'Passwort ist erforderlich' })
		.min(1, 'Passwort ist erforderlich')
		.min(8, 'Passwort muss länger als 8 Zeichen sein')
		.max(32, 'Passwort darf nicht länger als 32 Zeichen sein'),
});

export const registerSchema = z.object({
	email: z.string().email('Ungültige E-Mail-Adresse'),
	password: z
		.string()
		.min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
		.regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
		.regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
		.regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
	first_name: z
		.string()
		.min(2, 'Vorname muss mindestens 2 Zeichen lang sein')
		.max(50, 'Vorname darf nicht länger als 50 Zeichen sein'),
	surname: z
		.string()
		.min(2, 'Nachname muss mindestens 2 Zeichen lang sein')
		.max(50, 'Nachname darf nicht länger als 50 Zeichen sein'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const editSchema = z.object({
	email: z.string().email('Ungültige E-Mail-Adresse'),
	password: z
		.string()
		.min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
		.regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
		.regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
		.regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')
		.optional(),
	first_name: z
		.string()
		.min(2, 'Vorname muss mindestens 2 Zeichen lang sein')
		.max(50, 'Vorname darf nicht länger als 50 Zeichen sein'),
	surname: z
		.string()
		.min(2, 'Nachname muss mindestens 2 Zeichen lang sein')
		.max(50, 'Nachname darf nicht länger als 50 Zeichen sein'),
});

export type editSchema = z.infer<typeof editSchema>;

