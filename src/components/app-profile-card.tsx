'use client';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PencilIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface ProfileCardProps {
	user: {
		first_name: string;
		surname: string;
		email: string;
	};
}

export function ProfileCard({ user }: ProfileCardProps) {
	const router = useRouter();

	return (
		<Card className="w-full max-w-3xl">
			<CardHeader className="pb-8">
				<div className="flex justify-between items-start w-full">
					<div className="flex items-center space-x-6">
						<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
							<span className="text-4xl">{user.first_name[0]}</span>
						</div>
						<div>
							<h2 className="text-3xl font-bold">
								{user.first_name} {user.surname}
							</h2>
						</div>
					</div>
					<Button variant="outline" size="icon" onClick={() => router.push(`/profil/bearbeiten`)}>
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
					<p className="text-lg">{user.surname}</p>
				</div>
				<div>
					<label className="text-base font-medium text-muted-foreground">E-Mail</label>
					<p className="text-lg">{user.email}</p>
				</div>
			</CardContent>
			<CardFooter>
			</CardFooter>
		</Card>
	);
}
