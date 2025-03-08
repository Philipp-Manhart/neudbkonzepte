import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnterPollForm from '@/components/enter-poll-form';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<div className="relative min-h-screen w-full">
			<div className="absolute top-4 right-4">
				<Link href="/profile">
					<Button variant="ghost" size="icon">
						<User />
						<span className="sr-only">User profile</span>
					</Button>
				</Link>
			</div>

			<div className="flex flex-col items-center justify-center min-h-screen">
				<Card className="max-w-md w-full py-6 px-4">
					<CardHeader>
						<CardTitle>Abstimmung beitreten</CardTitle>
						<CardDescription>Geben Sie die Abstimmungs-ID ein</CardDescription>
					</CardHeader>
					<EnterPollForm />
				</Card>
			</div>
		</div>
	);
}
