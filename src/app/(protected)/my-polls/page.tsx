'use client';
import ExampleClientComponent from '@/components/test';
import { PastCreatedPolls } from '@/components/app-past-surveys';
import { getPollsByOwner } from '@/app/actions/poll';
import { useUser } from '@/lib/context';
import { useState, useEffect } from 'react';
import { Poll } from '@/lib/definitions';

export default function Dashboard() {
	const { userKey } = useUser();
	const [polls, setPolls] = useState<Poll[] | null>(null);

	useEffect(() => {
		async function getPolls() {
			const pollData = await getPollsByOwner(userKey as string);
			console.log(pollData);
			setPolls(pollData as Poll[]);
			//setPolls(mockPolls);
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
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<p className="text-lg">Willkommen im Dashboard!</p>
				<p className="text-lg">Hier können Sie Ihre Daten verwalten.</p>

				<ExampleClientComponent />
				<div>Du hast keine Abstimmungen</div>
			</div>
		);
	}

	// Ensure polls is an array before rendering
	if (!Array.isArray(polls)) {
		return <div>Fehler beim Laden der Abstimmungen</div>;
	}

	return (
		<div className="flex flex-col items-center pt-[25vh]">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p className="text-lg">Willkommen im Dashboard!</p>
			<p className="text-lg">Hier können Sie Ihre Daten verwalten.</p>

			<ExampleClientComponent />
			<div className="container mx-auto flex flex-col items-center py-10">
				<h3 className="text-bold text-4xl pb-6 text-center">Umfragen, die du durchgeführt hast</h3>
				<div className="w-full max-w-4xl">
					<PastCreatedPolls polls={polls} />
				</div> 
			</div>
		</div>
	);
}
