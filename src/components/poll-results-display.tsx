'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionResults } from '@/app/actions/poll_run';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuestionVotesChart from '@/components/app-question-votes-chart';
import { useUser } from '@/lib/context';

interface PollData {
	success: boolean;
	pollRunId: string;
	questions: Array<{
		questionId: string;
		type: string;
		questionText: string;
		possibleAnswers: string[];
		results: Record<string, number>;
		userAnswers?: string[]; // Add this to the interface
	}>;
}

interface PollResultsDisplayProps {
	pollRunId: string;
	isOwner: boolean;
}

export default function PollResultsDisplay({ pollRunId, isOwner }: PollResultsDisplayProps) {
	const { userKey } = useUser();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [pollData, setPollData] = useState<PollData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchPollData() {
			try {
				setIsLoading(true);
				if (!isOwner && userKey) {
					const data = await getQuestionResults(pollRunId, userKey as string);
					setPollData(data);
				} else {
					const data = await getQuestionResults(pollRunId);
					setPollData(data);
				}
			} catch (error) {
				console.error('Failed to fetch poll results:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchPollData();
	}, [pollRunId, userKey, isOwner]);

	// Convert data for the current question to the format expected by the chart
	const prepareChartData = (questionIndex: number) => {
		if (!pollData) return [];
		const question = pollData.questions[questionIndex];
		if (!question) return [];

		// Special handling for yes/no questions to normalize language
		if (question.type === 'yes-no') {
			// Create a map to store the votes
			const optionVotes: Record<string, number> = {
				Ja: 0,
				Nein: 0,
			};

			// Process the results, combining English and German answers
			Object.entries(question.results).forEach(([option, votes]) => {
				if (option === 'Yes' || option === 'Ja') {
					optionVotes['Ja'] = (optionVotes['Ja'] || 0) + votes;
				} else if (option === 'No' || option === 'Nein') {
					optionVotes['Nein'] = (optionVotes['Nein'] || 0) + votes;
				} else {
					// For any other unexpected value
					optionVotes[option] = votes;
				}
			});

			// Convert to chart format
			return Object.entries(optionVotes).map(([option, votes]) => ({
				option,
				votes,
			}));
		}

		// Handle multiple-choice questions differently
		if (question.type === 'multiple-choice') {
			// Create a map to store the votes for each option
			const optionVotes: Record<string, number> = {};

			// Process the results
			Object.entries(question.results).forEach(([optionStr, votes]) => {
				try {
					// Try to parse the key as JSON array
					const options = JSON.parse(optionStr);
					if (Array.isArray(options)) {
						// For each selected option in this vote, add the votes
						options.forEach((option) => {
							optionVotes[option] = (optionVotes[option] || 0) + votes;
						});
					} else {
						// If not an array, treat as a single option
						optionVotes[optionStr] = (optionVotes[optionStr] || 0) + votes;
					}
				} catch (e) {
					// If parsing fails, treat as a single option
					optionVotes[optionStr] = (optionVotes[optionStr] || 0) + votes;
				}
			});

			// Convert to the format expected by the chart
			return Object.entries(optionVotes).map(([option, votes]) => ({
				option,
				votes,
			}));
		}

		// For non-multiple-choice questions, use the existing logic
		return Object.entries(question.results).map(([option, votes]) => ({
			option,
			votes,
		}));
	};

	const goToPrevious = () => {
		if (!pollData) return;
		setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : pollData.questions.length - 1));
	};

	const goToNext = () => {
		if (!pollData) return;
		setCurrentQuestionIndex((prev) => (prev < pollData.questions.length - 1 ? prev + 1 : 0));
	};

	// Format user answer for display
	const formatUserAnswer = (question: any) => {
		if (!question.userAnswers || question.userAnswers.length === 0) {
			return 'Keine Antwort abgegeben';
		}

		// Handle different question types
		if (question.type === 'multiple-choice' || question.type === 'multiple') {
			return question.userAnswers.join(', ');
		}

		// For simple answers (single choice, yes-no, scale)
		return question.userAnswers[0];
	};

	// Early return while loading or if no data
	if (isLoading || !pollData) {
		return <div className="container py-6">Loading poll results...</div>;
	}

	const currentQuestion = pollData.questions[currentQuestionIndex];
	const chartData = prepareChartData(currentQuestionIndex);

	return (
		<div className="container py-6">
			<h1 className="text-3xl font-bold mb-6">Ergebnisse der Umfrage</h1>
			<div className="flex items-center justify-between mb-6">
				<p className="text-lg">
					Frage {currentQuestionIndex + 1} von {pollData.questions.length}
				</p>
				<div className="flex gap-4">
					<Button variant="outline" size="icon" onClick={goToPrevious} aria-label="Previous question">
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<Button variant="outline" size="icon" onClick={goToNext} aria-label="Next question">
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="max-w-3xl mx-auto">
				{currentQuestion && <QuestionVotesChart chartData={chartData} title={currentQuestion.questionText} />}
			</div>

			{!isOwner && currentQuestion && currentQuestion.userAnswers && (
				<div className="mt-8 max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex items-center">
					<p className="font-medium text-slate-700 dark:text-slate-200">
						Deine Antwort war: <span className="font-semibold">{formatUserAnswer(currentQuestion)}</span>
					</p>
				</div>
			)}
		</div>
	);
}
