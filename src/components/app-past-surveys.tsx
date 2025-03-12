//Hier die ganzen poll Cards mappen
import { PollCardDashboard } from './app-poll-dashboard-card';
import { Poll } from '@/lib/definitions';

interface PastPollsProps {
	polls: Poll[];
}

export function PastCreatedPolls({ polls }: PastPollsProps) {
	return (
		<>
			{polls.map((poll, index) => (
				<PollCardDashboard key={index} poll={poll} />
			))}
		</>
	);
}
