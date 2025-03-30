'use client';
import { PastCreatedPolls } from '@/components/app-past-surveys';
import { getPollsByOwner } from '@/app/actions/poll';
import { useUser } from '@/lib/context';
import { useState, useEffect } from 'react';
import { Poll } from '@/lib/definitions';
import { getPollRunsByPollId } from '@/app/actions/poll_run';

export default function Dashboard() {
	const { userKey } = useUser();
	const [polls, setPolls] = useState<Poll[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function getPolls() {
			setIsLoading(true);
			const pollData = await getPollsByOwner(userKey as string);

			if (Array.isArray(pollData)) {
				const pollsWithRunCounts = await Promise.all(
					pollData.map(async (poll) => {
						const response = await getPollRunsByPollId(poll.pollId);

						let pollRunCount = 0;
						if (response.success === true && response.pollRuns) {
							pollRunCount = response.pollRuns.length;
						}

						return {
							...poll,
							pollRunCount,
						};
					})
				);
				setPolls(pollsWithRunCounts as Poll[]);
			} else {
				// If not an array, set polls as empty array
				setPolls([]);
			}
			setIsLoading(false);
		}
		
		if (userKey) {
			getPolls();
		}
	}, [userKey]);

	if (isLoading) {
		return <div className="flex justify-center items-center min-h-[50vh]">Lade Abstimmungen...</div>;
	}

	// Check if polls is empty
	if (!polls || polls.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<h2 className="text-2xl font-semibold mb-2">Keine Abstimmungen vorhanden</h2>
				<p className="text-muted-foreground">Du hast bis jetzt keine Abstimmungen erstellt.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-3xl font-semibold text-center mb-6">Meine Abstimmungen:</h1>
			<PastCreatedPolls polls={polls} />
		</div>
	);
}
