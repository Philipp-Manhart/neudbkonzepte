'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface EditProfileFormProps {
	initialData?: {
		first_name: string;
		last_name: string;
		email: string;
	};
	action: (formData: FormData) => Promise<{
		success?: boolean;
		error?: string | Record<string, string>;
	}>;
}

export function EditProfileForm({ initialData, action }: EditProfileFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formData, setFormData] = useState({
		first_name: initialData?.first_name || '',
		last_name: initialData?.last_name || '',
		email: initialData?.email || '',
		password: '',
		confirmPassword: '',
	});

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<h2 className="text-2xl font-bold">Profildaten ändern</h2>
			</CardHeader>
			<CardContent>
				<form
					action={(formData) => {
						startTransition(async () => {
							if (showPasswordFields) {
								const password = formData.get('password') as string;
								const confirmPassword = formData.get('confirmPassword') as string;

								if (password !== confirmPassword) {
									setErrors({ password: 'Passwörter stimmen nicht überein' });
									return;
								}
							}

							try {
								const result = await action(formData);
								if (result?.error) {
									const errorData = typeof result.error === 'string' ? { general: result.error } : result.error;
									setErrors(errorData);
									return;
								}

								if (result?.success) {
									setErrors({});
									router.push('/profile');
								}
							} catch (err) {
								console.log(err);
								setErrors({ err: 'Etwas ist schiefgelaufen' });
							}
						});
					}}
					className="space-y-8">
					{errors.general && (
						<div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6">{errors.general}</div>
					)}
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-3">
							<Label htmlFor="first_name">Vorname</Label>
							<Input
								id="first_name"
								value={formData.first_name}
								onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
								disabled={isPending}
								required
								name="first_name"
							/>
							{errors.first_name && <p className="text-sm text-destructive mt-2">{errors.first_name}</p>}
						</div>
						<div className="space-y-3">
							<Label htmlFor="last_name">Nachname</Label>
							<Input
								id="last_name"
								value={formData.last_name}
								onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
								disabled={isPending}
								required
								name="last_name"
							/>
							{errors.last_name && <p className="text-sm text-destructive mt-2">{errors.last_name}</p>}
						</div>
					</div>
					<div className="space-y-3">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							disabled={isPending}
							required
							name="email"
						/>
						{errors.email && <p className="text-sm text-destructive mt-2">{errors.email}</p>}
					</div>
					<div className="space-y-3">
						<Button type="button" variant="outline" onClick={() => setShowPasswordFields(!showPasswordFields)}>
							{showPasswordFields ? 'Passwort verdecken' : 'Passwort ändern'}
						</Button>
					</div>

					{showPasswordFields && (
						<>
							<div className="space-y-3">
								<Label htmlFor="password">Neues Passwort</Label>
								<Input
									id="password"
									type="password"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									disabled={isPending}
									name="password"
								/>
								{errors.password && <p className="text-sm text-destructive mt-2">{errors.password}</p>}
							</div>
							<div className="space-y-3">
								<Label htmlFor="confirmPassword">Passwort bestätigen</Label>
								<Input
									id="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									disabled={isPending}
									name="confirmPassword"
								/>
							</div>
						</>
					)}
					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? 'Speichert...' : 'Änderung speichern'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
