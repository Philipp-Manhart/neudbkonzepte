'use client';

import { ParticipationCard } from './participation-card';

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
	if (participations.length === 0) {
		return (
			<div className="text-center py-10">
				<h2 className="text-xl font-semibold">Du hast noch an keinen Umfragen teilgenommen.</h2>
				<p className="text-muted-foreground mt-2">
					Deine Teilnahmen werden hier angezeigt, sobald du an Umfragen teilnimmst.
				</p>
			</div>
		);
	}

	// Sort participations by date (newest first)
	const sortedParticipations = [...participations].sort((a, b) => {
		return new Date(b.participatedAt).getTime() - new Date(a.participatedAt).getTime();
	});

	return (
		<div className="space-y-4">
			{sortedParticipations.map((participation) => (
				<ParticipationCard key={participation.pollRunId} participation={participation} isOwner={isOwner} />
			))}
		</div>
	);
}
