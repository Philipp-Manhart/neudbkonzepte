'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, UsersIcon, View, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { deletePollRun } from '@/app/actions/poll_run';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PollParticipation {
	pollRunId: string;
	pollId: string;
	pollName: string;
	description: string;
	participatedAt: string | Date;
	questionCount: number;
	participants: number;
}

interface ParticipationCardProps {
	participation: PollParticipation;
	isOwner: boolean;
	onDelete?: (pollRunId: string) => void;
}

export function ParticipationCard({ participation, isOwner, onDelete }: ParticipationCardProps) {
	const router = useRouter();
	const redirectViewLink = isOwner
		? `/poll-result/${participation.pollRunId}`
		: `/poll-result/participant/${participation.pollRunId}`;
	const [isDeleting, setIsDeleting] = useState(false);

	const formatDate = () => {
		if (participation.participatedAt instanceof Date) {
			return participation.participatedAt.toLocaleDateString();
		} else if (typeof participation.participatedAt === 'string') {
			return new Date(participation.participatedAt).toLocaleDateString();
		}
		return 'Unknown date';
	};

	async function handleDeletePollRun() {
		setIsDeleting(true);
		const response = await deletePollRun(participation.pollRunId as string);
		setIsDeleting(false);

		if (response.success) {
			toast.success('Umfragendurchlauf erfolgreich gelöscht.');
			// Call the onDelete callback to update the parent state
			if (onDelete) {
				onDelete(participation.pollRunId);
			}
			router.refresh();
		} else {
			console.error('Fehler beim Löschen des Durchlaufs.', response.error);
			toast.error('Fehler beim Löschen des Durchlaufs.');
		}
	}

	return (
		<Card className="h-full flex flex-col relative">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
				<div className="flex items-center gap-2">
					<h2 className="text-2xl font-bold">{participation.pollName}</h2>
					{isOwner && (
						<Button
							variant="outline"
							size="icon"
							onClick={handleDeletePollRun}
							disabled={isDeleting}
							className="ml-auto">
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
				<div className="text-sm text-muted-foreground">{formatDate()}</div>
			</CardHeader>
			<CardContent className="space-y-4 flex-grow">
				<div className="flex flex-col space-y-1">
					<div className="flex items-center gap-2">
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
						<label className="text-base font-medium text-muted-foreground">Beschreibung:</label>
					</div>
					<p className="text-lg pl-6">{participation.description}</p>
				</div>

				<div className="flex flex-col space-y-1">
					<div className="flex items-center gap-2">
						<UsersIcon className="h-4 w-4 text-muted-foreground" />
						<label className="text-base font-medium text-muted-foreground">Anzahl Teilnehmer:</label>
					</div>
					<p className="text-lg pl-6">{participation.participants}</p>
				</div>
			</CardContent>
			<CardFooter className="flex pt-2 gap-2 w-full">
				<Link className="w-full" href={redirectViewLink}>
					<Button variant="outline" className="w-full flex items-center gap-2">
						<View className="h-4 w-4" />
						Details ansehen
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
