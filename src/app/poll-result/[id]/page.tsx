import PollResultsDisplay from '@/components/poll-results-display';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return <PollResultsDisplay pollRunId={id} isOwner={true} />;
}
