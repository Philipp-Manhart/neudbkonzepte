import { getQuestionResults } from '@/app/actions/poll_run';
import PollResultsDisplay from '@/components/poll-results-display';
import { useUser } from '@/lib/context';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pollRunData = await getQuestionResults(id);

  return <PollResultsDisplay pollRunId={id} isOwner={false} />;
}
