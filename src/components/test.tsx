'use client';

import { useUser } from '@/lib/context';

export default function ExampleClientComponent() {
	const { userKey, userType } = useUser();

	return (
		<div>
			<p>{userKey ? `Logged in as: ${userKey}` : 'Not logged in'}</p>
			<p>{` Usertype ${userType}`}</p>
		</div>
	);
}
