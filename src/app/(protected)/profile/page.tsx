'use client';
import { getUser } from '@/app/actions/user';
import { ProfileCard } from '@/components/app-profile-card';
import { useUser } from '@/lib/context';
import { useEffect, useState } from 'react';
import { User } from '@/lib/definitions';

export default function ProfilePage() {
	const { userKey } = useUser();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		async function getUserInfo() {
			const user = await getUser(userKey as string);
			setUser(user as User);
		}
		getUserInfo();
	}, [userKey]);

	if (user === null) {
		return <div>Laden...</div>;
	}

	return (
		<div className="flex flex-col items-center w-full">
			<ProfileCard user={user as User} />
		</div>
	);
}
