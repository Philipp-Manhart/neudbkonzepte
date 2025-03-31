'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { useParticipantsSSE } from '@/hooks/use-participants-sse';

interface ParticipantListWaitingRoomProps {
	pollRunId: string;
	questionsCount: number;
	participants: {
		id: number;
		name: string | null;
	}[];
}

export default function ParticipantListWaitingRoom({
	pollRunId,
	questionsCount,
	participants: initialParticipants,
}: ParticipantListWaitingRoomProps) {
	// SSE hook to get real-time participant count
	const { participantsCount, loading } = useParticipantsSSE(pollRunId);

	const actualParticipantsCount = loading ? initialParticipants.length.toString() : participantsCount;

	return (
		<Card className="w-full p-6 mb-8">
			<div className="flex flex-col">
				<div className="flex justify-between mb-4">
					<span className="text-lg font-medium">Anzahl der Fragen</span>
					<span className="text-lg">{questionsCount}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-lg font-medium">Anzahl der Teilnehmer</span>
					<span className="text-lg">{actualParticipantsCount}</span>
				</div>
			</div>
		</Card>
	);
}
