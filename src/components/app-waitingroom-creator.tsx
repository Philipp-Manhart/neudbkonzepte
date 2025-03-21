'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { startPollRun } from '@/app/actions/poll_run';

interface WaitingRoomOwnerProps {
	pollRunId: string;
	questionsCount: number;
	participants: {
		id: number;
		name: string | null;
	}[];
}

export default function OwnerWaitingRoom({ questionsCount, participants, pollRunId }: WaitingRoomOwnerProps) {
	const [isStarting, setIsStarting] = useState<boolean>(false);
	async function handleStartPoll() {
		setIsStarting(true);
		await startPollRun(pollRunId);
		setIsStarting(false);
	}

	return (
		<div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Beginne die Umfrage sobald du willst.</h1>

			<div className="w-full p-4 rounded-lg mb-6">
				<p className="text-lg mb-2">Anzahl Fragen: {questionsCount}</p>
				<p className="text-lg">Teilnehmer bisher: {participants.length}</p>
			</div>

			<div className="w-full">
				<h2 className="text-xl font-semibold mb-3">Teilnehmer:</h2>
				<ul className="border rounded-lg divide-y ">
					{participants.map((participant) => (
						<li key={participant.id} className="px-4 py-3">
							{participant.name || 'Anonym'}
						</li>
					))}
				</ul>
			</div>
			<div className="pt-5">
				<Button onClick={handleStartPoll} disabled={isStarting}>
					<Play />
					Umfrage starten
				</Button>
			</div>
		</div>
	);
}
