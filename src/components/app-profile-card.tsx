'use client';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PencilIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/definitions';

interface ProfileCardProps {
	user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const router = useRouter();

	return (
		<Card className="w-full max-w-3xl">
			<CardHeader className="pb-8">
				<div className="flex justify-between items-start w-full">
					<div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
						<div>
							<h2 className="text-3xl font-bold">
								{user.first_name} {user.last_name}
							</h2>
						</div>
					</div>
					<Button variant="outline" size="icon" onClick={() => router.push(`/profile/edit`)}>
						<PencilIcon className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<label className="text-base font-medium text-muted-foreground">Vorname</label>
					<p className="text-lg">{user.first_name}</p>
				</div>
				<div>
					<label className="text-base font-medium text-muted-foreground">Nachname</label>
					<p className="text-lg">{user.last_name}</p>
				</div>
				<div>
					<label className="text-base font-medium text-muted-foreground">E-Mail</label>
					<p className="text-lg">{user.email}</p>
				</div>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
}
