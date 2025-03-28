'use client';
import React from 'react';
import ParticipantListWaitingRoom from './participant-list-waiting-room';

interface WaitingRoomOwnerProps {
	pollRunId: string;
	questionsCount: number;
	participants: {
		id: number;
		name: string | null;
	}[];
}

export default function ParticipantWaitingRoom({ pollRunId, questionsCount, participants }: WaitingRoomOwnerProps) {
	return (
		<div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Warte bis die Umfrage gestartet wird.</h1>

			<ParticipantListWaitingRoom pollRunId={pollRunId} questionsCount={questionsCount} participants={participants} />
		</div>
	);
}
