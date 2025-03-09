'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { login } from '@/app/actions/auth';
import { useState } from 'react';
import { SigninFormSchema } from '@/components/form-schemas';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SigninForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof SigninFormSchema>>({
		resolver: zodResolver(SigninFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof SigninFormSchema>) {
		setIsSubmitting(true);
		setError(null);
		const result = await login(values.email, values.password);

		if (result && !result.success) {
			setError(result.error);
		}
		setIsSubmitting(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-Mail</FormLabel>
							<FormControl>
								<Input placeholder="max-mustermann@email.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Passwort" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className="w-full" type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Anmeldung...' : 'Anmelden'}
				</Button>
			</form>
		</Form>
	);
}
