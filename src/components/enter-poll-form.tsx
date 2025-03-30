'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { enterPollRun } from '@/app/actions/poll_run';
import { useState } from 'react';
import { EnterPollFormSchema } from '@/components/form-schemas';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context';

export default function EnterPollForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { userKey } = useUser();

	const form = useForm<z.infer<typeof EnterPollFormSchema>>({
		resolver: zodResolver(EnterPollFormSchema),
		defaultValues: {
			enterCode: '',
		},
	});

	async function onSubmit(values: z.infer<typeof EnterPollFormSchema>) {
		setIsSubmitting(true);
		setError(null);
		const result = await enterPollRun(values.enterCode, userKey);
		if (result && !result.success) {
			setError(result.error);
			toast.error('Abstimmung beitreten fehlgeschlagen');
		} else {
			toast.success('Abstimmung beitreten erfolgreich.');
			router.push(`/participate/${values.enterCode}`);
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
					name="enterCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Abstimmung</FormLabel>
							<FormControl>
								<Input placeholder="Abstimmungs-ID" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Beitreten...' : 'Beitreten'}
				</Button>
			</form>
		</Form>
	);
}
