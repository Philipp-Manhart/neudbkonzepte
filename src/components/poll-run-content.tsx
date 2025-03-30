'use client';

import { useEffect, useState } from 'react';
import { getPoll } from '@/app/actions/poll';
import { getPollRun } from '@/app/actions/poll_run';
import { getQuestionsByPollId } from '@/app/actions/question';
import OwnerWaitingRoom from '@/components/app-waitingroom-creator';
import QuestionDisplay from '@/components/question-display';
import ParticipantWaitingRoom from './app-waitingroom-participants';

interface PollRunContentProps {
	params: string;
	isOwner: boolean;
}

const mockParticipants = [
	{ id: 1, name: 'Max Mustermann' },
	{ id: 2, name: 'Anna Schmidt' },
	{ id: 3, name: 'Erika Müller' },
	{ id: 4, name: null }, // Anonymous participant
	{ id: 5, name: 'Thomas Weber' },
	{ id: 6, name: null }, // Anonymous participant
];

export default function PollRunContent({ params, isOwner }: PollRunContentProps) {
	const [pollRun, setPollRun] = useState<any>(null);
	const [questions, setQuestions] = useState<any[]>([]);
	const [poll, setPoll] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [previousStatus, setPreviousStatus] = useState<string | null>(null);

	const fetchFullPollData = async () => {
		try {
			const responsePoll = await getPollRun(params);

			if (responsePoll.pollRun) {
				setPollRun(responsePoll.pollRun);
				setPreviousStatus(responsePoll.pollRun.status);

				const pollData = await getPoll(responsePoll.pollRun.pollId as string);
				setPoll(pollData);

				const responseQuestions = await getQuestionsByPollId(responsePoll.pollRun.pollId as string);
				if (responseQuestions.questions) {
					setQuestions(responseQuestions.questions);
				}
			}
		} catch (error) {
			console.error('Error fetching full poll data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const checkPollStatus = async () => {
		try {
			const responsePoll = await getPollRun(params);

			if (responsePoll.pollRun) {
				// Only update full data if status has changed
				if (responsePoll.pollRun.status !== previousStatus) {
					setPreviousStatus(responsePoll.pollRun.status);
					await fetchFullPollData();
				} else {
					// Just update the poll run if status hasn't changed
					setPollRun(responsePoll.pollRun);
				}
			}
		} catch (error) {
			console.error('Error checking poll status:', error);
		}
	};

	// Initial data load
	useEffect(() => {
		fetchFullPollData();
	}, [params]);

	// Status polling
	useEffect(() => {
		// Only set up polling if initial data is loaded
		if (!isLoading) {
			const intervalId = setInterval(() => {
				checkPollStatus();
			}, 2000);

			return () => clearInterval(intervalId);
		}
	}, [isLoading, params, previousStatus]);

	if (isLoading) {
		return <div className="flex justify-center items-center h-60">Laden...</div>;
	}

	if (!pollRun) {
		return <div>Umfrage nicht gefunden.</div>;
	}

	const questionsCount = questions.length;

	if (pollRun.status === 'open') {
		if (isOwner) {
			return <OwnerWaitingRoom questionsCount={questionsCount} participants={mockParticipants} pollRunId={params} />;
		} else {
			return (
				<ParticipantWaitingRoom questionsCount={questionsCount} participants={mockParticipants} pollRunId={params} />
			);
;
		}
	}

	if (pollRun.status === 'running') {
		return (
			<QuestionDisplay
				questions={questions}
				pollRunId={params}
				defaultDuration={poll?.defaultduration}
				isOwner={isOwner}
			/>
		);
	}

	if (pollRun.status === 'closed') {
		return (
			<div className="flex justify-center items-center h-60">
				<h1 className="text-4xl font-bold text-center">
					{isOwner
						? 'Diese Umfrage ist vorbei, schaue dir die Ergebnisse in Meine Durchläufe an!'
						: 'Diese Umfrage ist vorbei, danke für deine Teilnahme! Schaue dir die Ergebnisse in Meine Teilnahmen an!'}
				</h1>
			</div>
		);
	}

	return <div>Unbekannter Status: {pollRun.status}</div>;
}
