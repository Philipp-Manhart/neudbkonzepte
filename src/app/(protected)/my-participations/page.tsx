'use client';
import { getPollRunsByParticipant } from '@/app/actions/poll_run';
import { ParticipationList } from '@/components/participation-list';
import { useUser } from '@/lib/context';
import { useState, useEffect } from 'react';

// Mock data for poll participations
const mockParticipations = [
	{
		pollRunId: '1',
		pollId: '101',
		pollName: 'Mathematik Quiz',
		description: 'Ein Quiz über grundlegende mathematische Konzepte',
		participatedAt: '2023-05-15T14:30:00Z',
		questionCount: 10,
		participants: 80,
	},
	{
		pollRunId: '2',
		pollId: '102',
		pollName: 'Deutschunterricht Feedback',
		description: 'Feedbackumfrage zum Deutschunterricht',
		participatedAt: '2023-06-22T09:15:00Z',
		participants: 5,
	},
	{
		pollRunId: '3',
		pollId: '103',
		pollName: 'Informatik Test',
		description: 'Test über Programmierung und Algorithmen',
		participatedAt: '2023-07-05T11:00:00Z',
		questionCount: 15,
		participants: 92,
	},
];

export default function MyParticipations() {
	const { userKey } = useUser();
	const [participations, setParticipations] = useState(mockParticipations);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchParticipations() {
			if (userKey) {
				const regex = /^user:/;
				const newStr = userKey.replace(regex, '');

				console.log(newStr);
				console.log(userKey);

				setLoading(true);
				try {
					const realParticipations = await getPollRunsByParticipant(userKey);
					console.log(realParticipations);
					// Uncomment the line below to use real data instead of mock data
					// setParticipations(realParticipations);
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
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Meine Teilnahmen</h1>
			{loading ? <p>Lade Teilnahmen...</p> : <ParticipationList participations={participations} />}
		</div>
	);
}
