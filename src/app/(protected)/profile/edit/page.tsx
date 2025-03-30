'use client';
import { getUser, updateUser } from '@/app/actions/user';
import { EditProfileForm } from '@/components/app-edit-profil-form';
import { useUser } from '@/lib/context';
import { editSchema } from '@/lib/zod';
import { useState, useEffect } from 'react';

interface User{
	first_name: string;
	last_name: string;
	email: string;
}



export default function EditProfilePage() {
	const { userKey } = useUser();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		async function getUserInfo() {
			const user = await getUser(userKey as string);
			console.log(user);
			const userData={
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
			}
			setUser(userData);
		}
		getUserInfo();
	}, [userKey]);

	if (user === null) {
		return <div>Laden...</div>;
	}

	async function handleSubmit(formData: FormData, userKey: string) {

		try {
			const data = {
				email: formData.get('email')?.toString(),
				first_name: formData.get('first_name')?.toString(),
				last_name: formData.get('last_name')?.toString(),
				password: formData.get('password')?.toString() || undefined,
			};

			const validatedFields = editSchema.safeParse(data);

			if (!validatedFields.success) {
				const errors = validatedFields.error.issues.reduce((acc, issue) => {
					const field = issue.path[0];
					return { ...acc, [field]: issue.message };
				}, {});
				return { error: errors };
			}

			const new_email = formData.get('email')?.toString() as string;
			const new_first_name = formData.get('first_name')?.toString() as string;
			const new_last_name = formData.get('last_name')?.toString() as string;

			//Hier Profil Updaten
			//TODO geht noch nicht (es kommt vom Backend Update fehlgeschlagen)
			const response = await updateUser(
				userKey,
				new_first_name,
				new_last_name,
				new_email
			);

			console.log(response)
			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: { error: 'Das Update ist fehlgeschlagen, bitte erneut versuchen.' } };
		}
	}

	return (
		<div className="container mx-auto py-10 px-4 sm:px-6">
			<EditProfileForm initialData={user} action={handleSubmit} />
		</div>
	);
}
