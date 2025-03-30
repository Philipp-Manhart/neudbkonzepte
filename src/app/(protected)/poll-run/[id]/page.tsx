import PollRunContent from '@/components/poll-run-content';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return <PollRunContent params={id as string} isOwner={true}/>;
}
