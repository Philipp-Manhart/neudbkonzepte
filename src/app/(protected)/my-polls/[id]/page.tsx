import PollDetailsContent from '../../../../components/app-poll-details-content';
import { getQuestionsByPollId } from '@/app/actions/question';
import { getPoll } from '@/app/actions/poll';
import { Poll } from '@/lib/definitions';
import { QuestionData } from '@/lib/definitions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	console.log(id);

	const questionData = await getQuestionsByPollId(id);
	const pollData = await getPoll(id);

	const formattedQuestionData = questionData.questions?.map((q) => ({
		questionId: q.questionId, 
		type: q.type as QuestionData['type'], 
		questionText: q.questionText || '',
		options: q.possibleAnswers || [],
		error: null,
	}));

	return (
		<PollDetailsContent
			pollId={id}
			initialPollData={pollData as Poll}
			initialQuestionData={formattedQuestionData as QuestionData[]}
		/>
	);
}
