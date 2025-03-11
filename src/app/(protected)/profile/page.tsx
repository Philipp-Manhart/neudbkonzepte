'use client';
import { getUser } from '@/app/actions/user';
import { ProfileCard } from '@/components/app-profile-card';
import { useUser } from '@/lib/context';
import { useEffect, useState } from 'react';
import { User } from '@/lib/definitions';

export default function ProfilePage() {
	const { userId } = useUser();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		async function getUserInfo() {
			console.log('userId', userId);
			const user = await getUser(userId as string);
			console.log(user);
			//hier sind die werte immer null
			setUser(user as User);
		}
		getUserInfo();
	}, [userId]);

	if (user === null) {
		return <div>Laden...</div>;
	}

	return (
		<div className="container mx-auto py-10 px-4 sm:px-6">
			<div className="flex flex-col items-center gap-10">
				<div className="w-full max-w-4xl">
					<ProfileCard user={user as User} />
				</div>
			</div>
		</div>
	);
}
