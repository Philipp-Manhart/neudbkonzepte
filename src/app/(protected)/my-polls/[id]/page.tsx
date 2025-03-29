import { getQuestionsByPollId } from '@/app/actions/question';
import { getPoll } from '@/app/actions/poll';
import { Poll } from '@/lib/definitions';
import { QuestionData } from '@/lib/definitions';
import PollViewContent from '@/components/app-view-poll-content';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

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
		<PollViewContent pollData={pollData as Poll} questionData={formattedQuestionData as QuestionData[]}/>
	);
}
