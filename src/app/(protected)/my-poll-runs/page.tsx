'use client';
import { getPoll } from '@/app/actions/poll';
import { getPollRunsByOwner, getPollRun } from '@/app/actions/poll_run';
import { getQuestionsByPollId } from '@/app/actions/question';
import { ParticipationList } from '@/components/participation-list';
import { useUser } from '@/lib/context';
import { useState, useEffect } from 'react';

export default function MyParticipations() {
	const { userKey } = useUser();
	const [participations, setParticipations] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchParticipations() {
			if (userKey) {
				setLoading(true);
				try {
					const realParticipations = await getPollRunsByOwner(userKey);
					console.log(realParticipations);

					// Fetch additional details for each poll run
					const enhancedPollRuns = await Promise.all(
						realParticipations.pollRuns.map(async (pollRun) => {
							try {
								// Extract pollId from the response
								const pollId = pollRun.pollKey.split(':')[1];

								// Get poll details
								const pollDetails = await getPoll(pollId);

								// Format date only if participatedAt doesn't already exist
								const formattedDate = new Date(parseInt(pollRun.created));

								// Only add properties that don't already exist
								return {
									...pollRun,
									pollId: pollId,
									pollName: pollDetails?.name || pollRun.pollName || 'Unnamed Poll',
									description: pollDetails?.description || pollRun.description || '',
									participatedAt: formattedDate,
								};
							} catch (error) {
								console.error(`Failed to fetch details for poll ${pollRun.pollRunId}:`, error);
								return pollRun; // Return the original poll run data if there's an error
							}
						})
					);
					console.log(enhancedPollRuns);

					setParticipations(enhancedPollRuns);
				} catch (error) {
					console.error('Failed to fetch participations:', error);
				} finally {
					setLoading(false);
				}
			}
		}

		fetchParticipations();
	}, [userKey]);

	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Meine Umfragendurchläufe</h1>
			{loading ? (
				<p className="text-center">Lade Umfragendurchläufe...</p>
			) : (
				<ParticipationList participations={participations} isOwner={true} />
			)}
		</div>
	);
}
