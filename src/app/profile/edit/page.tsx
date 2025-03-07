import { EditProfileForm } from '@/components/app-edit-profil-form';
import { editSchema } from '@/lib/zod';

export default async function EditProfilePage() {

	const userData = {
		first_name: 'Gabriel',
		surname: 'Jung',
		email: 'test@test.com',
	};

	async function handleSubmit(formData: FormData) {
		'use server';

		try {
			const data = {
				email: formData.get('email')?.toString(),
				first_name: formData.get('first_name')?.toString(),
				surname: formData.get('surname')?.toString(),
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

      //Hier Profil Updaten
			/* await updateProfile({
				nutzer_id: parseInt(session?.user?.id as string),
				...validatedFields.data,
			}); */

			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: { error: 'Das Update ist fehlgeschlagen, bitte erneut versuchen.' } };
		}
	}

	return (
		<div className="container mx-auto py-10">
			<EditProfileForm initialData={userData} action={handleSubmit} />
		</div>
	);
}
