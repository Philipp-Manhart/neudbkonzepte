'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { startPollRun } from '@/app/actions/poll_run';
import { useRouter } from 'next/navigation';
import ParticipantListWaitingRoom from './participant-list-waiting-room';

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
	const router = useRouter();
	async function handleStartPoll() {
		setIsStarting(true);
		await startPollRun(pollRunId);
		router.refresh();
		setIsStarting(false);
	}

	return (
		<div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Beginne die Umfrage sobald du willst.</h1>

			<ParticipantListWaitingRoom pollRunId={pollRunId} questionsCount={questionsCount} participants={participants} />
			<div className="pt-5">
				<Button onClick={handleStartPoll} disabled={isStarting}>
					<Play />
					Umfrage starten
				</Button>
			</div>
		</div>
	);
}
