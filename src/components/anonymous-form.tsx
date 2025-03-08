'use client';

import { Button } from '@/components/ui/button';
import { signupAnonymous } from '@/app/actions/auth';
import { useState } from 'react';

export default function AnonymousForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleAnonymousSignup() {
		setIsSubmitting(true);
		await signupAnonymous();
		setIsSubmitting(false);
	}

	return (
		<div className="space-y-4">
			<Button className="w-full" onClick={handleAnonymousSignup} disabled={isSubmitting}>
				{isSubmitting ? 'Verarbeitung...' : 'Anonym teilnehmen'}
			</Button>
		</div>
	);
}
