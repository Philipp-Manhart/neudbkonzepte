'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, UsersIcon, PlayIcon, EditIcon, View } from 'lucide-react';
import { Button } from './ui/button';
import { Poll } from '@/lib/definitions';

interface pollCardProps {
	poll: Poll;
}

export function PollCardDashboard({ poll }: pollCardProps) {
	return (
		<Card className="w-full max-w-3xl mb-4">
			<CardHeader>
				<div className="flex justify-between items-start w-full">
					<div>
						<h2 className="text-2xl font-bold">{poll.title}</h2>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-2">
					<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					<label className="text-base font-medium text-muted-foreground">Beschreibung:</label>
					<p className="text-lg">{poll.description}</p>
				</div>
				<div className="flex items-center gap-2">
					<UsersIcon className="h-4 w-4 text-muted-foreground" />
					<label className="text-base font-medium text-muted-foreground">Anzahl der Fragen:</label>
					<p className="text-lg">{poll.questionCount}</p>
				</div>
				<div className="flex items-center gap-2">
					<UsersIcon className="h-4 w-4 text-muted-foreground" />
					<label className="text-base font-medium text-muted-foreground">Anzahl Fragen:</label>
					<p className="text-lg">{poll.questionCount}</p>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end pt-2 gap-2">
				<Button className="flex items-center gap-2">
					<PlayIcon className="h-4 w-4" />
					Umfrage Durchführen
				</Button>
				<Button variant="outline" className="flex items-center gap-2">
					<EditIcon className="h-4 w-4" />
					Umfrage bearbeiten
				</Button>
				<Button variant="outline" className="flex items-center gap-2">
					<View className="h-4 w-4" />
					Umfrage ansehen
				</Button>
			</CardFooter>
		</Card>
	);
}
