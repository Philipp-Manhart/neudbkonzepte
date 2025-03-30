'use client';
import { useState, useEffect } from 'react';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';
import QuestionVotesChart from '@/components/app-question-votes-chart';
import { useCurrentResultsSSE } from '@/hooks/use-current-results-sse';

interface YesNoQuestionProps {
	questionId: string;
	questionText: string;
	onAnswerSelected?: (value: string) => void;
	pollRunId: string;
	isOwner?: boolean;
}

export default function YesNoQuestion({
	questionId,
	questionText,
	onAnswerSelected,
	pollRunId,
	isOwner = false,
}: YesNoQuestionProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	// Use the SSE hook to get real-time results
	const { results, isLoading, error } = useCurrentResultsSSE(pollRunId, questionId);

	// Transform the results data for the chart
	const [chartData, setChartData] = useState([
		{ option: 'Ja', votes: 0 },
		{ option: 'Nein', votes: 0 },
	]);

	// Update chart data when results change
	useEffect(() => {
		if (results) {
			setChartData([
				{ option: 'Ja', votes: results['Yes'] || 0 },
				{ option: 'Nein', votes: results['No'] || 0 },
			]);
		}
	}, [results]);

	// Show chart immediately if user is the owner
	if (isOwner || isSaved) {
		return (
			<div className="py-4 px-2 sm:px-0">
				<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>
				{isLoading ? (
					<div className="text-center py-4">Loading results...</div>
				) : (
					<QuestionVotesChart title={questionText} chartData={chartData} />
				)}
				{error && <div className="text-red-500 text-center mt-2">Error loading results: {error}</div>}
			</div>
		);
	}

	const handleSubmit = async () => {
		if (!selectedOption) return;

		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, selectedOption as string);
			setIsSaved(true);
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleOptionClick = (option: 'Yes' | 'No') => {
		// Prevent changes if answer is already saved
		if (isSaved) return;

		setSelectedOption(option);
		if (onAnswerSelected) {
			onAnswerSelected(option);
		}
	};

	return (
		<div className="py-4 px-2 sm:px-0">
			<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>

			<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mt-4 max-w-md mx-auto">
				<button
					onClick={() => handleOptionClick('Yes')}
					className={`px-8 py-4 rounded-lg border-2 transition-all ${
						selectedOption === 'Yes'
							? 'bg-green-500 text-white border-green-600 dark:bg-green-600 dark:border-green-500'
							: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
					} ${isSaved ? 'opacity-80 cursor-not-allowed' : ''}`}
					disabled={isSaved}>
					Ja
				</button>

				<button
					onClick={() => handleOptionClick('No')}
					className={`px-8 py-4 rounded-lg border-2 transition-all ${
						selectedOption === 'No'
							? 'bg-red-500 text-white border-red-600 dark:bg-red-600 dark:border-red-500'
							: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
					} ${isSaved ? 'opacity-80 cursor-not-allowed' : ''}`}
					disabled={isSaved}>
					Nein
				</button>
			</div>

			<SubmitAnswer
				onSubmit={handleSubmit}
				isDisabled={isSaving || !selectedOption || isSaved}
				buttonText={isSaving ? 'Saving...' : isSaved ? 'Antwort Gespeichert' : 'Save Answer'}
			/>
		</div>
	);
}
