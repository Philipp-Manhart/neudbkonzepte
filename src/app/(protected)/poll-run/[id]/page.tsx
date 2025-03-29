import { getPoll } from '@/app/actions/poll';
import { getPollRun } from '@/app/actions/poll_run';
import { getQuestionsByPollId } from '@/app/actions/question';
import QuestionVotesChart from '@/components/app-question-votes-chart';
import OwnerWaitingRoom from '@/components/app-waitingroom-creator';

const mockParticipants = [
	{ id: 1, name: 'Max Mustermann' },
	{ id: 2, name: 'Anna Schmidt' },
	{ id: 3, name: 'Erika Müller' },
	{ id: 4, name: null }, // Anonymous participant
	{ id: 5, name: 'Thomas Weber' },
	{ id: 6, name: null }, // Anonymous participant
];

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const responsePoll = await getPollRun(id);

	const responseQuestions = await getQuestionsByPollId(responsePoll.pollRun?.pollId as string);

  const poll = await getPoll(responsePoll.pollRun?.pollId as string);

	const questionsCount = responseQuestions.questions?.length;

	const currentQuestion = responseQuestions.questions[0];

	const chartData = [
	{ option: 'Manuel', votes: 3 },
	{ option: 'Bob', votes: 5},
/* 	{ option: 'Micheal', votes: 5 },
	{ option: 'Here', votes: 7 },
	{ option: 'Glory', votes: 4 },
	{ option: 'Save', votes: 1 },  */
];

	if (responsePoll.pollRun?.status === 'open') {
		return (
			<OwnerWaitingRoom questionsCount={questionsCount as number} participants={mockParticipants} pollRunId={id} />
		);
	}

	if (responsePoll.pollRun?.status === 'running') {

		return (
			<QuestionVotesChart title={currentQuestion.questionText} chartData={chartData}/>
		);
	}
}
