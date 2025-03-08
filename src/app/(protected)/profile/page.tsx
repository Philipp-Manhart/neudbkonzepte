import { ProfileCard } from '@/components/app-profile-card';


export default async function ProfilePage() {
	const userData = {
		first_name: 'Gabriel',
		last_name: 'Jung',
		email: 'test@test.com',
	};
	
	return (
		<div className="container mx-auto py-10 px-4 sm:px-6">
			<div className="flex flex-col items-center gap-10">
				<div className="w-full max-w-4xl">
					<ProfileCard user={userData} />
				</div>
			</div>
		</div>
	);
}
