import { PollCard } from './app-poll-card';
import { Poll } from '@/lib/definitions';
import { useState } from 'react';

interface PastPollsProps {
	polls: Poll[];
}

export function PastCreatedPolls({ polls }: PastPollsProps) {
	const [localPolls, setLocalPolls] = useState(polls);

	const handlePollDeleted = (pollId: string) => {
		setLocalPolls((prev) => prev.filter((p) => p.pollId !== pollId));
	};

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
			{localPolls.map((poll, index) => (
				<PollCard key={index} poll={poll} onDelete={handlePollDeleted} />
			))}
		</div>
	);
}
