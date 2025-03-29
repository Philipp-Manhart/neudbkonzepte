'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, UsersIcon, PlayIcon, EditIcon, View, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Poll } from '@/lib/definitions';
import Link from 'next/link';
import { createPollRun } from '@/app/actions/poll_run';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface pollCardProps {
	poll: Poll;
}

export function PollCard({ poll }: pollCardProps) {
	const router = useRouter();
	const [isStarting, setIsStarting] = useState(false);
	const redirectEditLink = `/my-polls/${poll.pollId}/edit`;
	const redirectViewLink = `/my-polls/${poll.pollId}`;

	async function handleStartPoll() {
		setIsStarting(true);
		const newPollRun = await createPollRun(poll.pollId as string);

		//const result = await startPollRun(newPollRun.pollRunId as string)

		setIsStarting(false);

		if (newPollRun.pollRunId) {
			router.push(`/poll-run/${newPollRun.pollRunId}`);
		} else {
			console.error('Failed to start poll:', newPollRun.error);
		}
	}

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
				<h2 className="text-2xl font-bold">{poll.name}</h2>
				<Button variant="outline">
					<Trash2 className="h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent className="space-y-4 flex-grow">
				<div className="flex flex-col space-y-1">
					<div className="flex items-center gap-2">
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
						<label className="text-base font-medium text-muted-foreground">Beschreibung:</label>
					</div>
					<p className="text-lg pl-6">{poll.description}</p>
				</div>

				<div className="flex flex-col space-y-1">
					<div className="flex items-center gap-2">
						<UsersIcon className="h-4 w-4 text-muted-foreground" />
						<label className="text-base font-medium text-muted-foreground">Anzahl der Fragen:</label>
					</div>
					<p className="text-lg pl-6">{poll.questionCount}</p>
				</div>

				<div className="flex flex-col space-y-1">
					<div className="flex items-center gap-2">
						<UsersIcon className="h-4 w-4 text-muted-foreground" />
						<label className="text-base font-medium text-muted-foreground">Anzahl Durchführungen:</label>
					</div>
					<p className="text-lg pl-6">{poll.pollRunCount}</p>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col md:flex-row pt-2 gap-2 w-full">
				<Button className="w-full flex-1 flex items-center gap-2" onClick={handleStartPoll} disabled={isStarting}>
					<PlayIcon className="h-4 w-4" />
					{isStarting ? 'Wird gestartet...' : 'Durchführen'}
				</Button>
				<Link className="w-full flex-1 flex items-center gap-2" href={redirectEditLink}>
					<Button variant="outline" className="w-full flex-1 flex items-center gap-2">
						<EditIcon className="h-4 w-4" />
						Bearbeiten
					</Button>
				</Link>
				<Link className="w-full flex-1 flex items-center gap-2" href={redirectViewLink}>
					<Button variant="outline" className="w-full flex-1 flex items-center gap-2">
						<View />
						Ansehen
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
