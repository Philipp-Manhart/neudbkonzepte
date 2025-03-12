//Hier die ganzen poll Cards mappen
import { PollCard } from './app-poll-card';
import { Poll } from '@/lib/definitions';

interface PastPollsProps {
	polls: Poll[];
}

export function PastCreatedPolls({ polls }: PastPollsProps) {
	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
			{polls.map((poll, index) => (
				<PollCard key={index} poll={poll} />
			))}
		</div>
	);
}
