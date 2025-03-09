'use client';

import { useUser } from '@/lib/context';

export default function ExampleClientComponent() {
	const { userId, userType } = useUser();

	return (
		<div>
			<p>{userId ? `Logged in as: ${userId}` : 'Not logged in'}</p>
			<p>{` Usertype ${userType}`}</p>
		</div>
	);
}
