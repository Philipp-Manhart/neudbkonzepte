'use client';

import { useUser } from '@/lib/context';

export default function ExampleClientComponent() {
	const userId = useUser();

	return <div>{userId ? `Logged in as: ${userId}` : 'Not logged in'}</div>;
}
