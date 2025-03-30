'use client';

import { ParticipationCard } from './participation-card';
import { useState } from 'react';

export interface PollParticipation {
	pollRunId: string;
	pollId: string;
	pollName: string;
	description: string;
	participatedAt: string;
	questionCount: number;
	scorePercentage?: number;
}

interface ParticipationListProps {
	participations: PollParticipation[];
	isOwner: boolean;
}

export function ParticipationList({ participations, isOwner }: ParticipationListProps) {
	// Add local state to manage participations
	const [localParticipations, setLocalParticipations] = useState(participations);

	// Handler to remove a participation from the local state
	const handleParticipationDeleted = (pollRunId: string) => {
		setLocalParticipations((prev) => prev.filter((p) => p.pollRunId !== pollRunId));
	};

	if (localParticipations.length === 0) {
		return isOwner ? (
			<div className="text-center py-10">
				<h2 className="text-xl font-semibold">Du hast noch keine Umfragen durchgeführt.</h2>
				<p className="text-muted-foreground mt-2">
					Deine Durchführungen werden hier angezeigt, sobald du eine Umfrage startest.
				</p>
			</div>
		) : (
			<div className="text-center py-10">
				<h2 className="text-xl font-semibold">Du hast an keinen Umfragen teilgenommen.</h2>
				<p className="text-muted-foreground mt-2">
					Deine Teilnahmen werden hier angezeigt, sobald du an einer Umfrage teilnimmst.
				</p>
			</div>
		);
	}

	// Sort participations by date (newest first)
	const sortedParticipations = [...localParticipations].sort((a, b) => {
		return new Date(b.participatedAt).getTime() - new Date(a.participatedAt).getTime();
	});

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
			{sortedParticipations.map((participation) => (
				<ParticipationCard
					key={participation.pollRunId}
					participation={participation}
					isOwner={isOwner}
					onDelete={handleParticipationDeleted}
				/>
			))}
		</div>
	);
}
