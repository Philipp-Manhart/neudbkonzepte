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
}

export function ParticipationList({ participations }: ParticipationListProps) {
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

	return (
		<div className="space-y-4">
			{participations.map((participation) => (
				<ParticipationCard key={participation.pollRunId} participation={participation} />
			))}
		</div>
	);
}
