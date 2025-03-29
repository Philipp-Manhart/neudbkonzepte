'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuestionVotesChart from '@/components/app-question-votes-chart';

// Mock data type definition based on getQuestionResults return type
interface PollData {
	success: boolean;
	pollRunId: string;
	questions: Array<{
		questionId: string;
		type: string;
		questionText: string;
		possibleAnswers: string[];
		results: Record<string, number>;
	}>;
}

interface PollResultsDisplayProps {
	pollRunId: string;
	pollData: PollData;
}

export default function PollResultsDisplay({ pollRunId, pollData }: PollResultsDisplayProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	// Convert data for the current question to the format expected by the chart
	const prepareChartData = (questionIndex: number) => {
		const question = pollData.questions[questionIndex];
		if (!question) return [];

		return Object.entries(question.results).map(([option, votes]) => ({
			option,
			votes,
		}));
	};

	const goToPrevious = () => {
		setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : pollData.questions.length - 1));
	};

	const goToNext = () => {
		setCurrentQuestionIndex((prev) => (prev < pollData.questions.length - 1 ? prev + 1 : 0));
	};

	const currentQuestion = pollData.questions[currentQuestionIndex];
	const chartData = prepareChartData(currentQuestionIndex);

	return (
		<div className="container py-6">
			<h1 className="text-3xl font-bold mb-6">Poll Results</h1>
			<p className="mb-4 text-muted-foreground">Poll ID: {pollRunId}</p>

			<div className="flex items-center justify-between mb-6">
				<p className="text-lg">
					Question {currentQuestionIndex + 1} of {pollData.questions.length}
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
		</div>
	);
}
