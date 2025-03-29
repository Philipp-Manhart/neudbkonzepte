import PollResultsDisplay from '@/components/poll-results-display';
import { getQuestionResults } from '@/app/actions/poll_run';

// Mock data in the format returned by getQuestionResults
const mockPollData = {
	success: true,
	pollRunId: 'abc123',
	questions: [
		{
			questionId: 'q1',
			type: 'single',
			questionText: 'What is your favorite color?',
			possibleAnswers: ['Red', 'Blue', 'Green', 'Yellow'],
			results: {
				Red: 12,
				Blue: 25,
				Green: 8,
				Yellow: 15,
			},
		},
		{
			questionId: 'q2',
			type: 'multiple',
			questionText: 'Which programming languages do you use?',
			possibleAnswers: ['JavaScript', 'Python', 'Java', 'C#', 'TypeScript'],
			results: {
				JavaScript: 30,
				Python: 22,
				Java: 18,
				'C#': 15,
				TypeScript: 27,
			},
		},
		{
			questionId: 'q3',
			type: 'single',
			questionText: 'How often do you code?',
			possibleAnswers: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
			results: {
				Daily: 35,
				Weekly: 20,
				Monthly: 10,
				Rarely: 5,
			},
		},
	],
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const pollRunData = await getQuestionResults(id);

	console.log(pollRunData);

	return <PollResultsDisplay pollRunId={id} pollData={pollRunData} />;
}
