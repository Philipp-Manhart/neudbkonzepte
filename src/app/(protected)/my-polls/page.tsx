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

	useEffect(() => {
		async function getPolls() {
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
			}
		}
		getPolls();
	}, [userKey]);

	if (polls === null) {
		return <div>Loading...</div>;
	}

	// Check if polls contains an error object
	if (!Array.isArray(polls) && polls.error) {
		return (
			<div className="flex flex-col items-center pt-[25vh]">
				<p className="text-xl font-semibold">Du hast keine Abstimmungen</p>
			</div>
		);
	}

	// Ensure polls is an array before rendering
	if (!Array.isArray(polls)) {
		return <div>Fehler beim Laden der Abstimmungen</div>;
	}

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-3xl font-semibold text-center mb-6">Meine Abstimmungen:</h1>
			<PastCreatedPolls polls={polls} />
		</div>
	);
}
